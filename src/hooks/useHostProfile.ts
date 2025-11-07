import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './useProfile';
import { useAuth } from '@/contexts/AuthContext';

export interface HostSpace {
  id: string;
  title: string;
  city: string;
  address: string;
  price_per_hour: number;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  images: string[];
  capacity: number;
  area_sqm: number;
  category_id: string;
  categories?: {
    name: string;
  };
}

export interface HostReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  space_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  spaces: {
    title: string;
  };
}

export interface HostStats {
  totalReviews: number;
  averageRating: number;
  yearsHosting: number;
  totalSpaces: number;
  activeSpaces: number;
  totalBookings: number;
}

/**
 * Hook to fetch a host's public profile by user ID
 */
export const useHostProfile = (userId: string) => {
  return useQuery({
    queryKey: ['host-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch all spaces owned by a host
 */
export const useHostSpaces = (userId: string) => {
  return useQuery({
    queryKey: ['host-spaces', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('spaces')
        .select(
          `
          *,
          categories(name)
        `
        )
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HostSpace[];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch all reviews for a host's spaces
 */
export const useHostReviews = (userId: string) => {
  return useQuery({
    queryKey: ['host-reviews', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // First get all space IDs for this host
      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', userId);

      if (spacesError) throw spacesError;
      if (!spaces || spaces.length === 0) return [];

      const spaceIds = spaces.map((s) => s.id);

      // Then get all reviews for those spaces
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(
          `
          *,
          profiles(full_name, avatar_url),
          spaces(title)
        `
        )
        .in('space_id', spaceIds)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      return reviews as HostReview[];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to calculate host statistics
 */
export const useHostStats = (userId: string) => {
  return useQuery({
    queryKey: ['host-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Get profile to calculate years hosting
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Get all spaces for this host
      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('id, is_active, rating, total_reviews')
        .eq('owner_id', userId);

      if (spacesError) throw spacesError;

      // Get all bookings for this host's spaces
      const spaceIds = spaces?.map((s) => s.id) || [];
      let totalBookings = 0;

      if (spaceIds.length > 0) {
        const { count, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .in('space_id', spaceIds);

        if (bookingsError) throw bookingsError;
        totalBookings = count || 0;
      }

      // Calculate statistics
      const totalReviews = spaces?.reduce((sum, space) => sum + (space.total_reviews || 0), 0) || 0;

      const averageRating =
        spaces && spaces.length > 0
          ? spaces.reduce((sum, space) => sum + (space.rating || 0), 0) / spaces.length
          : 0;

      const yearsHosting = profile
        ? new Date().getFullYear() - new Date(profile.created_at).getFullYear()
        : 0;

      const activeSpaces = spaces?.filter((s) => s.is_active).length || 0;

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        yearsHosting: yearsHosting === 0 ? 1 : yearsHosting, // Show at least 1 year
        totalSpaces: spaces?.length || 0,
        activeSpaces,
        totalBookings,
      } as HostStats;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update host-specific profile fields
 */
export const useUpdateHostProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: {
      languages?: string[];
      work_description?: string;
      response_rate?: number;
      response_time_hours?: number;
      is_identity_verified?: boolean;
      is_superhost?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['host-profile'] });
      queryClient.invalidateQueries({ queryKey: ['host-stats'] });
    },
  });
};
