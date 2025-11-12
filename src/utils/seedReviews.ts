import { supabase } from '@/integrations/supabase/client';

/**
 * Seed data for creating reviews for bookings
 * Reviews will have ratings 3-5 with appropriate comments
 */

interface ReviewSeedData {
  user_id: string;
  space_id: string;
  booking_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

/**
 * Comments for rating 3 (neutral/regular)
 */
const rating3Comments = [
  'El espacio estaba bien, cumplió con lo básico.',
  'Regular, podría mejorar en algunos aspectos.',
  'Buen espacio, aunque esperaba un poco más.',
  'Cumple con lo esperado, nada extraordinario.',
  'Adecuado para el precio, pero hay áreas de mejora.',
  'El espacio es funcional, aunque le falta algo de personalidad.',
  'Buen lugar para trabajar, aunque podría ser más cómodo.',
  'Satisfactorio, pero hay espacios mejores en la zona.',
];

/**
 * Comments for rating 4 (positive)
 */
const rating4Comments = [
  'Excelente espacio, muy recomendable.',
  'Muy buena experiencia, lo volvería a usar.',
  'Buen espacio, bien ubicado y cómodo.',
  'Me gustó mucho, tiene todo lo necesario.',
  'Excelente servicio y ambiente de trabajo.',
  'Muy satisfecho con la reserva, todo perfecto.',
  'Buen espacio para reuniones, bien equipado.',
  'Recomendado, buena relación calidad-precio.',
  'Espacio agradable y funcional, volveré.',
  'Muy buena experiencia, el espacio superó mis expectativas.',
];

/**
 * Comments for rating 5 (very positive)
 */
const rating5Comments = [
  'Espacio increíble, superó mis expectativas.',
  'Perfecto en todos los aspectos, altamente recomendado.',
  'Excelente espacio, impecable y muy bien equipado.',
  'Me encantó, el mejor espacio que he usado.',
  'Espacio excepcional, todo perfecto y muy cómodo.',
  'Increíble experiencia, definitivamente volveré.',
  'Espacio perfecto, super profesional y bien cuidado.',
  'Excelente en todos los sentidos, 100% recomendado.',
  'Me encantó el espacio, tiene todo lo que necesitas.',
  'Espacio de primer nivel, muy satisfecho con la experiencia.',
];

/**
 * Gets random comment based on rating
 */
function getRandomComment(rating: number): string {
  if (rating === 3) {
    return rating3Comments[Math.floor(Math.random() * rating3Comments.length)];
  } else if (rating === 4) {
    return rating4Comments[Math.floor(Math.random() * rating4Comments.length)];
  } else {
    return rating5Comments[Math.floor(Math.random() * rating5Comments.length)];
  }
}

/**
 * Gets random rating between 3 and 5
 */
function getRandomRating(): number {
  // 60% chance of 5, 30% chance of 4, 10% chance of 3
  const random = Math.random();
  if (random < 0.6) return 5;
  if (random < 0.9) return 4;
  return 3;
}

/**
 * Calculates review created_at date (at least 1 hour after booking end, within 6 months)
 */
function calculateReviewCreatedAt(endDate: string, endTime: string): string {
  const bookingEnd = new Date(`${endDate}T${endTime}`);

  // Add at least 1 hour (random between 1 hour and 7 days)
  const hoursAfter = Math.random() * (7 * 24 - 1) + 1; // 1 hour to 7 days
  const reviewDate = new Date(bookingEnd.getTime() + hoursAfter * 60 * 60 * 1000);

  // Ensure it's not in the future (if booking is in October 2025, reviews should be after that)
  const now = new Date();
  if (reviewDate > now) {
    // If booking is in the future, set review date to 1 hour after booking end
    reviewDate.setTime(bookingEnd.getTime() + 60 * 60 * 1000);
  }

  return reviewDate.toISOString();
}

/**
 * Creates reviews for bookings
 * @param bookingIds Array of booking IDs to create reviews for
 * @param reviewPercentage Percentage of bookings to review (0-1, default 0.7 = 70%)
 */
export async function createSeedReviews(
  bookingIds: string[],
  reviewPercentage: number = 0.7
): Promise<{
  success: boolean;
  reviewIds: string[];
  message: string;
  stats: {
    created: number;
    failed: number;
  };
}> {
  try {
    console.log('🌱 Starting reviews creation...');
    console.log(
      `📊 Creating reviews for ${Math.floor(bookingIds.length * reviewPercentage)} bookings`
    );

    // Get all bookings with their details
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, user_id, space_id, end_date, end_time, status, payment_status')
      .in('id', bookingIds)
      .eq('status', 'confirmed')
      .eq('payment_status', 'paid');

    if (bookingsError) {
      throw bookingsError;
    }

    if (!bookings || bookings.length === 0) {
      return {
        success: false,
        reviewIds: [],
        message: 'No confirmed and paid bookings found.',
        stats: {
          created: 0,
          failed: 0,
        },
      };
    }

    console.log(`✅ Found ${bookings.length} confirmed and paid bookings`);

    // Filter bookings to review (random selection)
    const bookingsToReview = bookings.filter(() => Math.random() < reviewPercentage);

    console.log(`📝 Creating reviews for ${bookingsToReview.length} bookings`);

    const reviewIds: string[] = [];
    let createdCount = 0;
    let failedCount = 0;

    // Create reviews for each booking
    for (const booking of bookingsToReview) {
      try {
        // Check if review already exists
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('booking_id', booking.id)
          .single();

        if (existingReview) {
          console.log(`⏭️  Review already exists for booking ${booking.id}`);
          continue;
        }

        // Get random rating (3-5)
        const rating = getRandomRating();

        // Get random comment based on rating
        const comment = getRandomComment(rating);

        // Calculate review created_at (at least 1 hour after booking end)
        const created_at = calculateReviewCreatedAt(booking.end_date, booking.end_time);

        // Create review data
        const reviewData: ReviewSeedData = {
          user_id: booking.user_id,
          space_id: booking.space_id,
          booking_id: booking.id,
          rating,
          comment,
          created_at,
        };

        // Insert review
        const { data: review, error: reviewError } = await supabase
          .from('reviews')
          .insert([reviewData])
          .select('id')
          .single();

        if (reviewError) {
          console.error(`❌ Error creating review for booking ${booking.id}:`, reviewError);
          failedCount++;
          continue;
        }

        if (review) {
          reviewIds.push(review.id);
          createdCount++;
        }

        // Note: Space rating is automatically updated by database trigger
        // No need to manually update via Edge Function

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`❌ Error creating review:`, error);
        failedCount++;
      }
    }

    const message = `✨ Reviews creation completed!\n📊 Created: ${createdCount}, Failed: ${failedCount}\n⭐ Ratings: 3-5 with appropriate comments`;
    console.log(message);

    return {
      success: true,
      reviewIds,
      message,
      stats: {
        created: createdCount,
        failed: failedCount,
      },
    };
  } catch (error) {
    console.error('❌ Error in createSeedReviews:', error);
    return {
      success: false,
      reviewIds: [],
      message: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        created: 0,
        failed: 0,
      },
    };
  }
}

/**
 * Gets all reviews for regular users
 */
export async function getSeedReviews(userIds: string[]): Promise<string[]> {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, user_id')
      .in('user_id', userIds);

    if (error) throw error;

    return reviews?.map((r) => r.id) || [];
  } catch (error) {
    console.error('❌ Error getting seed reviews:', error);
    return [];
  }
}

/**
 * Clears all reviews for regular users
 */
export async function clearSeedReviews(userIds: string[]): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log('🧹 Clearing seed reviews...');

    const { error } = await supabase.from('reviews').delete().in('user_id', userIds);

    if (error) throw error;

    const message = `✅ Cleared reviews for ${userIds.length} users`;
    console.log(message);

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error('❌ Error clearing seed reviews:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
