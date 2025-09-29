import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OwnerStats {
  total_earnings: number;
  this_month_earnings: number;
  total_bookings: number;
  active_listings: number;
  avg_rating: number;
  occupancy_rate: number;
}

export interface OwnerSpace {
  id: string;
  title: string;
  city: string;
  price_per_hour: number;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  images: string[];
  bookings_this_month: number;
  earnings_this_month: number;
}

export interface OwnerBooking {
  id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: number;
  guests_count: number;
  notes?: string;
  space_id: string;
  user_id: string;
  spaces: {
    title: string;
  };
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

export const useOwnerSpaces = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['owner-spaces', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get spaces and their bookings count/earnings
      const { data: spaces, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // For each space, get booking stats
      const spacesWithStats = await Promise.all(
        spaces.map(async (space) => {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('total_amount, created_at')
            .eq('space_id', space.id);
          
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          
          const monthlyBookings = bookings?.filter((booking: any) => {
            const bookingDate = new Date(booking.created_at);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          }) || [];
          
          return {
            id: space.id,
            title: space.title,
            city: space.city,
            price_per_hour: space.price_per_hour,
            is_active: space.is_active,
            rating: space.rating || 0,
            total_reviews: space.total_reviews || 0,
            images: space.images || [],
            bookings_this_month: monthlyBookings.length,
            earnings_this_month: monthlyBookings.reduce((sum: number, booking: any) => 
              sum + Number(booking.total_amount), 0
            )
          } as OwnerSpace;
        })
      );
      
      return spacesWithStats;
    },
    enabled: !!user
  });
};

export const useOwnerBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['owner-bookings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          spaces!inner(title, owner_id),
          profiles(full_name, avatar_url)
        `)
        .eq('spaces.owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as OwnerBooking[];
    },
    enabled: !!user
  });
};

export const useOwnerStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['owner-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all bookings for owner's spaces
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          total_amount,
          created_at,
          status,
          spaces!inner(owner_id)
        `)
        .eq('spaces.owner_id', user.id);
      
      if (bookingsError) throw bookingsError;

      // Get owner's spaces count
      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('id, is_active, rating, total_reviews')
        .eq('owner_id', user.id);
      
      if (spacesError) throw spacesError;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthBookings = bookings?.filter((booking: any) => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear;
      }) || [];

      const totalEarnings = bookings?.reduce((sum: number, booking: any) => 
        sum + Number(booking.total_amount), 0
      ) || 0;

      const thisMonthEarnings = thisMonthBookings.reduce((sum: number, booking: any) => 
        sum + Number(booking.total_amount), 0
      );

      const activeSpaces = spaces?.filter(space => space.is_active).length || 0;
      
      const avgRating = spaces?.length > 0 
        ? spaces.reduce((sum, space) => sum + (space.rating || 0), 0) / spaces.length
        : 0;

      // Calculate occupancy rate (simplified calculation)
      const occupancyRate = activeSpaces > 0 ? Math.min(100, (bookings?.length || 0) * 5) : 0;

      return {
        total_earnings: totalEarnings,
        this_month_earnings: thisMonthEarnings,
        total_bookings: bookings?.length || 0,
        active_listings: activeSpaces,
        avg_rating: Math.round(avgRating * 10) / 10,
        occupancy_rate: Math.round(occupancyRate)
      } as OwnerStats;
    },
    enabled: !!user
  });
};