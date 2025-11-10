import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Space {
  id: string;
  title: string;
  description: string;
  address: string;
  address_object?: Record<string, unknown> | null;
  city: string;
  price_per_hour: number;
  currency: string;
  discounts?: Record<string, number> | null;
  capacity: number;
  area_sqm?: number;
  images: string[];
  features: string[];
  amenities: string[];
  availability_hours: Record<string, unknown>;
  policies?: string;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  owner_id: string;
  category_id?: string;
  latitude?: number;
  longitude?: number;
  categories?: { name: string };
  profiles?: { full_name: string };
}

export const useSpaces = (filters?: {
  searchTerm?: string;
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
}) => {
  return useQuery({
    queryKey: ['spaces', filters],
    queryFn: async () => {
      let query = supabase
        .from('spaces')
        .select(
          `
          *,
          categories(name),
          profiles(full_name)
        `
        )
        .eq('is_active', true);

      if (filters?.searchTerm) {
        query = query.or(
          `title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,city.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price_per_hour', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price_per_hour', filters.maxPrice);
      }

      if (filters?.minCapacity) {
        query = query.gte('capacity', filters.minCapacity);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Space[];
    },
  });
};

export const useSpace = (id: string) => {
  return useQuery({
    queryKey: ['space', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select(
          `
          *,
          categories(name),
          profiles(full_name, avatar_url, bio)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Space;
    },
    enabled: !!id,
  });
};

export const useCreateSpace = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (
      spaceData: Omit<
        Space,
        'id' | 'created_at' | 'updated_at' | 'owner_id' | 'rating' | 'total_reviews'
      >
    ) => {
      if (!user) throw new Error('User not authenticated');

      const {
        address_object,
        availability_hours,
        discounts,
        images,
        features,
        amenities,
        ...rest
      } = spaceData;

      const payload: Database['public']['Tables']['spaces']['Insert'] = {
        ...rest,
        owner_id: user.id,
        address_object: address_object ? (address_object as unknown as Json) : null,
        availability_hours: availability_hours ? (availability_hours as unknown as Json) : null,
        discounts: discounts ? (discounts as unknown as Json) : null,
        images: images ?? null,
        features: features ?? null,
        amenities: amenities ?? null,
      };

      const { data, error } = await supabase.from('spaces').insert(payload).select().single();

      if (error) throw error;

      const { error: hostFlagError } = await supabase
        .from('profiles')
        .update({ is_host: true })
        .eq('user_id', user.id);

      if (hostFlagError) {
        console.error('Failed to mark user as host', hostFlagError);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Space> & { id: string }) => {
      const {
        address_object,
        availability_hours,
        discounts,
        images,
        features,
        amenities,
        ...rest
      } = updates;

      const payload: Database['public']['Tables']['spaces']['Update'] = {
        ...rest,
      };

      if (address_object !== undefined) {
        payload.address_object = address_object ? (address_object as unknown as Json) : null;
      }

      if (availability_hours !== undefined) {
        payload.availability_hours = availability_hours
          ? (availability_hours as unknown as Json)
          : null;
      }

      if (discounts !== undefined) {
        payload.discounts = discounts ? (discounts as unknown as Json) : null;
      }

      if (images !== undefined) {
        payload.images = images ?? null;
      }

      if (features !== undefined) {
        payload.features = features ?? null;
      }

      if (amenities !== undefined) {
        payload.amenities = amenities ?? null;
      }

      const { data, error } = await supabase
        .from('spaces')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      queryClient.invalidateQueries({ queryKey: ['space', data.id] });
    },
  });
};
