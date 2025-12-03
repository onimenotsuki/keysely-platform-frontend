import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Favorite {
  id: string;
  user_id: string;
  space_id: string;
  created_at: string;
  spaces: {
    id: string;
    title: string;
    city: string;
    price_per_hour: number;
    currency: string;
    images: string[];
    rating: number;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(
          `
          *,
          spaces(id, title, city, price_per_hour, currency, images, rating)
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (spaceId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('space_id', spaceId)
        .maybeSingle();

      if (existing) {
        // Remove favorite
        const { error } = await supabase.from('favorites').delete().eq('id', existing.id);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add favorite
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          space_id: spaceId,
        });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      // Invalidate all favorites queries (including those with user?.id)
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      // Invalidate all favorite-status queries to update heart icons everywhere
      queryClient.invalidateQueries({ queryKey: ['favorite-status'] });
    },
  });
};

export const useIsFavorite = (spaceId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorite-status', spaceId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('space_id', spaceId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!spaceId,
  });
};
