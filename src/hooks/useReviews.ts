import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Note: Space rating is now automatically updated by database trigger
// No need to manually update via Edge Function

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
    address?: unknown;
  };
  spaces?: {
    title?: string;
    images?: string[];
  };
  bookings?: {
    start_date?: string;
    end_date?: string;
    total_hours?: number;
  } | null;
}

export interface CreateReviewData {
  space_id: string;
  booking_id: string; // Now required
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
        .select(
          `
          *,
          profiles!inner(full_name, avatar_url, address),
          bookings(start_date, end_date, total_hours)
        `
        )
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
        .select(
          `
          *,
          spaces!inner(title, images)
        `
        )
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

      if (!reviewData.booking_id) {
        throw new Error('booking_id es requerido para crear una review');
      }

      // Validate review before creating
      const { data: validationResult, error: validationError } = await supabase.functions.invoke(
        'validate-review',
        {
          body: {
            user_id: user.id,
            space_id: reviewData.space_id,
            booking_id: reviewData.booking_id,
          },
        }
      );

      if (validationError) {
        throw new Error(`Error de validación: ${validationError.message}`);
      }

      if (!validationResult?.valid) {
        const errorMessage = validationResult?.error || 'No se puede crear la review';
        throw new Error(errorMessage);
      }

      // Create the review
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            ...reviewData,
          },
        ])
        .select()
        .single();

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          throw new Error('Ya has reseñado esta reserva');
        }
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['space-reviews', data.space_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      queryClient.invalidateQueries({ queryKey: ['space', data.space_id] });
      queryClient.invalidateQueries({ queryKey: ['can-review', data.space_id, data.booking_id] });

      // Note: Space rating is automatically updated by database trigger
      // Just invalidate the space query to refresh the UI

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
    mutationFn: async ({
      reviewId,
      updates,
    }: {
      reviewId: string;
      updates: Partial<CreateReviewData>;
    }) => {
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

      // Note: Space rating is automatically updated by database trigger
      // Just invalidate the space query to refresh the UI

      toast.success('Review actualizada exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error updating review:', error);
      toast.error(`Error al actualizar review: ${error.message}`);
    },
  });
};

// Hook para verificar si el usuario puede hacer review de un espacio
export const useCanUserReview = (spaceId: string, bookingId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['can-review', spaceId, bookingId, user?.id],
    queryFn: async (): Promise<{ canReview: boolean; hasReviewed: boolean; reason?: string }> => {
      if (!user || !spaceId || !bookingId || bookingId.trim() === '') {
        return { canReview: false, hasReviewed: false, reason: 'Faltan datos requeridos' };
      }

      // Get the specific booking to validate
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, user_id, space_id, status, payment_status, end_date, end_time')
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single();

      if (bookingError) {
        if (bookingError.code === 'PGRST116') {
          return { canReview: false, hasReviewed: false, reason: 'Reserva no encontrada' };
        }
        throw bookingError;
      }

      // Validate booking belongs to the correct space
      if (booking.space_id !== spaceId) {
        return {
          canReview: false,
          hasReviewed: false,
          reason: 'La reserva no corresponde a este espacio',
        };
      }

      // Validate booking is confirmed and paid
      if (booking.status !== 'confirmed' || booking.payment_status !== 'paid') {
        return {
          canReview: false,
          hasReviewed: false,
          reason: 'La reserva debe estar confirmada y pagada',
        };
      }

      // Calculate booking end datetime
      const endDateTime = new Date(`${booking.end_date}T${booking.end_time}`);
      const now = new Date();

      // Validate at least 1 hour has passed since booking end
      const oneHourAfterEnd = new Date(endDateTime.getTime() + 60 * 60 * 1000);
      if (now < oneHourAfterEnd) {
        return {
          canReview: false,
          hasReviewed: false,
          reason: 'Debe esperar al menos 1 hora después del fin de la reserva',
        };
      }

      // Validate booking is not older than 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      if (endDateTime < sixMonthsAgo) {
        return {
          canReview: false,
          hasReviewed: false,
          reason: 'Han pasado más de 6 meses desde la reserva',
        };
      }

      // Check if user has already reviewed this booking
      const { data: existingReview, error: reviewError } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .eq('user_id', user.id)
        .single();

      if (reviewError && reviewError.code !== 'PGRST116') throw reviewError;
      const hasReviewed = !!existingReview;

      return {
        canReview: !hasReviewed,
        hasReviewed,
        reason: hasReviewed ? 'Ya has reseñado esta reserva' : undefined,
      };
    },
    enabled: !!user && !!spaceId && !!bookingId,
  });
};
