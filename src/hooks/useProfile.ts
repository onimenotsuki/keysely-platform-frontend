import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface AddressData {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  company?: string;
  address?: AddressData | null;
  languages?: string[];
  response_rate?: number;
  response_time_hours?: number;
  is_identity_verified?: boolean;
  is_superhost?: boolean;
  is_host?: boolean | null;
  work_description?: string;
  created_at: string;
  updated_at: string;
}

const isAddressData = (value: unknown): value is AddressData => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.streetAddress === 'string' &&
    typeof candidate.city === 'string' &&
    typeof candidate.state === 'string' &&
    typeof candidate.postalCode === 'string' &&
    typeof candidate.country === 'string'
  );
};

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const profileRow = data as Database['public']['Tables']['profiles']['Row'];
      const parsedAddress = isAddressData(profileRow.address) ? profileRow.address : null;

      const formattedProfile: Profile = {
        id: profileRow.id,
        user_id: profileRow.user_id,
        full_name: profileRow.full_name ?? undefined,
        avatar_url: profileRow.avatar_url ?? undefined,
        phone: profileRow.phone ?? undefined,
        bio: profileRow.bio ?? undefined,
        company: profileRow.company ?? undefined,
        address: parsedAddress,
        languages: profileRow.languages ?? undefined,
        response_rate: profileRow.response_rate ?? undefined,
        response_time_hours: profileRow.response_time_hours ?? undefined,
        is_identity_verified: profileRow.is_identity_verified ?? undefined,
        is_superhost: profileRow.is_superhost ?? undefined,
        is_host: profileRow.is_host,
        work_description: profileRow.work_description ?? undefined,
        created_at: profileRow.created_at,
        updated_at: profileRow.updated_at,
      };

      return formattedProfile;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('User not authenticated');

      const { address, ...rest } = updates;
      const payload: Database['public']['Tables']['profiles']['Update'] = {
        ...rest,
      };

      if (address !== undefined) {
        payload.address = address ? (address as unknown as Json) : null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
