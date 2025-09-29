import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SpaceBooking {
  id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  user_id: string;
  guests_count: number;
  total_amount: number;
  profiles?: {
    full_name: string;
  };
}

export const useBookingsBySpace = (spaceId: string) => {
  return useQuery({
    queryKey: ['bookings', 'space', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('space_id', spaceId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as SpaceBooking[];
    },
    enabled: !!spaceId
  });
};