import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Helper function to update space rating via edge function
const updateSpaceRating = async (spaceId: string) => {
  try {
    await supabase.functions.invoke('update-space-rating', {
      body: { space_id: spaceId }
    });
  } catch (error) {
    console.error('Error updating space rating:', error);
  }
};

export interface Review {
  id: string;
  user_id: string;
  space_id: string;
  booking_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
  spaces?: {
    title?: string;
    images?: string[];
  };
}

export interface CreateReviewData {
  space_id: string;
  booking_id?: string;
  rating: number;
  comment?: string;
}

// Hook para obtener reviews de un espacio
export const useSpaceReviews = (spaceId: string) => {
  return useQuery({
    queryKey: ['space-reviews', spaceId],
    queryFn: async (): Promise<Review[]> => {
      if (!spaceId) throw new Error('Space ID is required');
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!spaceId,
  });
};

// Hook para obtener reviews de un usuario
export const useUserReviews = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async (): Promise<Review[]> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          spaces!inner(title, images)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

// Hook para crear una review
export const useCreateReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          user_id: user.id,
          ...reviewData,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['space-reviews', data.space_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      queryClient.invalidateQueries({ queryKey: ['space', data.space_id] });
      
      // Update space rating
      updateSpaceRating(data.space_id);
      
      toast.success('Review enviada exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error creating review:', error);
      toast.error(`Error al enviar review: ${error.message}`);
    },
  });
};

// Hook para actualizar una review
export const useUpdateReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, updates }: { reviewId: string; updates: Partial<CreateReviewData> }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .eq('user_id', user.id) // Ensure user can only update their own reviews
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['space-reviews', data.space_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      
      // Update space rating
      updateSpaceRating(data.space_id);
      
      toast.success('Review actualizada exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error updating review:', error);
      toast.error(`Error al actualizar review: ${error.message}`);
    },
  });
};

// Hook para verificar si el usuario puede hacer review de un espacio
export const useCanUserReview = (spaceId: string, bookingId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['can-review', spaceId, bookingId, user?.id],
    queryFn: async (): Promise<{ canReview: boolean; hasReviewed: boolean }> => {
      if (!user || !spaceId) {
        return { canReview: false, hasReviewed: false };
      }
      
      // Check if user has completed booking for this space
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('space_id', spaceId)
        .eq('user_id', user.id)
        .eq('status', 'completed');
      
      if (bookingError) throw bookingError;
      
      const hasCompletedBooking = bookings && bookings.length > 0;
      
      // Check if user has already reviewed this space
      let hasReviewed = false;
      if (bookingId) {
        const { data: existingReview, error: reviewError } = await supabase
          .from('reviews')
          .select('id')
          .eq('space_id', spaceId)
          .eq('user_id', user.id)
          .eq('booking_id', bookingId)
          .single();
        
        if (reviewError && reviewError.code !== 'PGRST116') throw reviewError;
        hasReviewed = !!existingReview;
      } else {
        const { data: existingReviews, error: reviewError } = await supabase
          .from('reviews')
          .select('id')
          .eq('space_id', spaceId)
          .eq('user_id', user.id);
        
        if (reviewError) throw reviewError;
        hasReviewed = existingReviews && existingReviews.length > 0;
      }
      
      return {
        canReview: hasCompletedBooking && !hasReviewed,
        hasReviewed,
      };
    },
    enabled: !!user && !!spaceId,
  });
};