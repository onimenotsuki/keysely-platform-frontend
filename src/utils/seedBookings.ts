import { supabase } from '@/integrations/supabase/client';

/**
 * Seed data for creating fake bookings in October 2025
 * All bookings will have status 'confirmed' and payment_status 'paid'
 */

interface BookingSeedData {
  user_id: string;
  space_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_amount: number;
  currency: string;
  guests_count: number;
  status: string;
  payment_status: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
}

/**
 * Gets random date in October 2025
 */
function getRandomDateInOctober2025(): Date {
  const year = 2025;
  const month = 9; // October (0-indexed)
  const day = Math.floor(Math.random() * 31) + 1; // Random day 1-31
  return new Date(year, month, day);
}

/**
 * Gets random time between 8:00 and 18:00
 */
function getRandomStartTime(): string {
  const hour = Math.floor(Math.random() * 10) + 8; // 8-17
  const minute = Math.random() < 0.5 ? 0 : 30; // :00 or :30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Calculates end time based on start time and total hours
 */
function calculateEndTime(startTime: string, totalHours: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + totalHours * 60 * 60 * 1000);
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Generates fake Stripe payment intent ID
 */
function generateFakePaymentIntentId(): string {
  return `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generates fake Stripe session ID
 */
function generateFakeSessionId(): string {
  return `cs_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Creates bookings for regular users in October 2025
 * @param userIds Array of user IDs to create bookings for
 * @param bookingsPerUser Average number of bookings per user
 */
export async function createSeedBookings(
  userIds: string[],
  bookingsPerUser: number = 3
): Promise<{
  success: boolean;
  bookingIds: string[];
  message: string;
  stats: {
    created: number;
    failed: number;
  };
}> {
  try {
    console.log('🌱 Starting bookings creation...');
    console.log(`📅 Creating bookings for October 2025`);
    console.log(`👥 Users: ${userIds.length}`);
    console.log(`📊 Bookings per user: ~${bookingsPerUser}`);

    // Get all active spaces
    const { data: spaces, error: spacesError } = await supabase
      .from('spaces')
      .select('id, price_per_hour, currency')
      .eq('is_active', true);

    if (spacesError) {
      throw spacesError;
    }

    if (!spaces || spaces.length === 0) {
      return {
        success: false,
        bookingIds: [],
        message: 'No active spaces found. Please create spaces first.',
        stats: {
          created: 0,
          failed: 0,
        },
      };
    }

    console.log(`✅ Found ${spaces.length} active spaces`);

    const bookingIds: string[] = [];
    let createdCount = 0;
    let failedCount = 0;

    // Create bookings for each user
    for (const userId of userIds) {
      // Random number of bookings per user (1 to bookingsPerUser * 2)
      const numBookings = Math.floor(Math.random() * bookingsPerUser) + 1;

      for (let i = 0; i < numBookings; i++) {
        try {
          // Select random space
          const randomSpace = spaces[Math.floor(Math.random() * spaces.length)];

          // Generate random date in October 2025
          const bookingDate = getRandomDateInOctober2025();
          const startDate = bookingDate.toISOString().split('T')[0];

          // Generate random start time
          const startTime = getRandomStartTime();

          // Random total hours (1 to 8 hours)
          const totalHours = Math.floor(Math.random() * 8) + 1;

          // Calculate end time
          const endTime = calculateEndTime(startTime, totalHours);

          // Check if booking extends to next day
          const [startHour, startMinute] = startTime.split(':').map(Number);
          const [endHour, endMinute] = endTime.split(':').map(Number);
          let endDate = startDate;

          if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
            // Booking extends to next day
            const nextDay = new Date(bookingDate);
            nextDay.setDate(nextDay.getDate() + 1);
            // Ensure end date is still in October 2025 (or at least not too far in the future)
            const octoberEnd = new Date(2025, 9, 31); // October 31, 2025
            if (nextDay <= octoberEnd) {
              endDate = nextDay.toISOString().split('T')[0];
            } else {
              // If extending would go past October, just use same day end
              endDate = startDate;
            }
          }

          // Calculate total amount
          const pricePerHour = Number.parseFloat(String(randomSpace.price_per_hour));
          const totalAmount = Math.round(pricePerHour * totalHours * 100) / 100; // Round to 2 decimals

          // Insert booking using database function (bypasses RLS)
          // Note: Using type assertion because the function isn't in generated types yet
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: bookingId, error: bookingError } = await (supabase.rpc as any)(
            'insert_seed_booking',
            {
              p_user_id: userId,
              p_space_id: randomSpace.id,
              p_start_date: startDate,
              p_end_date: endDate,
              p_start_time: startTime,
              p_end_time: endTime,
              p_total_hours: totalHours,
              p_total_amount: totalAmount,
              p_currency: randomSpace.currency || 'MXN',
              p_guests_count: Math.floor(Math.random() * 5) + 1, // 1-5 guests
              p_status: 'confirmed',
              p_payment_status: 'paid',
              p_stripe_payment_intent_id: generateFakePaymentIntentId(),
              p_stripe_session_id: generateFakeSessionId(),
              p_notes: null,
            }
          );

          if (bookingError) {
            console.error(`❌ Error creating booking for user ${userId}:`, bookingError);
            failedCount++;
            continue;
          }

          if (bookingId) {
            bookingIds.push(bookingId);
            createdCount++;
          }

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`❌ Error creating booking:`, error);
          failedCount++;
        }
      }
    }

    const message = `✨ Bookings creation completed!\n📊 Created: ${createdCount}, Failed: ${failedCount}\n📅 All bookings in October 2025`;
    console.log(message);

    return {
      success: true,
      bookingIds,
      message,
      stats: {
        created: createdCount,
        failed: failedCount,
      },
    };
  } catch (error) {
    console.error('❌ Error in createSeedBookings:', error);
    return {
      success: false,
      bookingIds: [],
      message: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        created: 0,
        failed: 0,
      },
    };
  }
}

/**
 * Gets all bookings for regular users in October 2025
 */
export async function getSeedBookings(userIds: string[]): Promise<string[]> {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, user_id, start_date')
      .in('user_id', userIds)
      .eq('status', 'confirmed')
      .eq('payment_status', 'paid')
      .gte('start_date', '2025-10-01')
      .lte('start_date', '2025-10-31');

    if (error) throw error;

    return bookings?.map((b) => b.id) || [];
  } catch (error) {
    console.error('❌ Error getting seed bookings:', error);
    return [];
  }
}

/**
 * Clears all bookings for regular users
 */
export async function clearSeedBookings(userIds: string[]): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log('🧹 Clearing seed bookings...');

    const { error } = await supabase.from('bookings').delete().in('user_id', userIds);

    if (error) throw error;

    const message = `✅ Cleared bookings for ${userIds.length} users`;
    console.log(message);

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error('❌ Error clearing seed bookings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
