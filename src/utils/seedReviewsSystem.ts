import { createRegularUsers, getRegularUserIds, clearRegularUsers } from './seedRegularUsers';
import { createSeedBookings, getSeedBookings, clearSeedBookings } from './seedBookings';
import { createSeedReviews, getSeedReviews, clearSeedReviews } from './seedReviews';
import { supabase } from '@/integrations/supabase/client';

/**
 * Main orchestrator for the review system seed data
 * Creates users, bookings, and reviews in the correct order
 */

interface ReviewSystemSeedOptions {
  bookingsPerUser?: number;
  reviewPercentage?: number;
  clearExisting?: boolean;
}

/**
 * Seeds the entire review system
 * Creates 10 regular users, bookings in October 2025, and reviews
 */
export async function seedReviewSystem(options: ReviewSystemSeedOptions = {}): Promise<{
  success: boolean;
  message: string;
  stats: {
    users: number;
    bookings: number;
    reviews: number;
  };
}> {
  try {
    const { bookingsPerUser = 3, reviewPercentage = 0.7, clearExisting = false } = options;

    console.log('🌱 Starting review system seed...');
    console.log(
      `📊 Options: ${bookingsPerUser} bookings/user, ${(reviewPercentage * 100).toFixed(0)}% reviews`
    );

    // Step 1: Clear existing data if requested
    if (clearExisting) {
      console.log('🗑️  Clearing existing review system data...');
      const existingUserIds = await getRegularUserIds();
      if (existingUserIds.length > 0) {
        await clearSeedReviews(existingUserIds);
        await clearSeedBookings(existingUserIds);
        await clearRegularUsers();
      }
      console.log('✅ Existing data cleared');
    }

    // Step 2: Create regular users
    console.log('👥 Step 1: Creating regular users...');
    const usersResult = await createRegularUsers();

    if (!usersResult.success || usersResult.userIds.length === 0) {
      return {
        success: false,
        message: 'Failed to create regular users',
        stats: {
          users: 0,
          bookings: 0,
          reviews: 0,
        },
      };
    }

    console.log(`✅ Created/found ${usersResult.userIds.length} regular users`);

    // Step 3: Create bookings
    console.log('📅 Step 2: Creating bookings for October 2025...');
    const bookingsResult = await createSeedBookings(usersResult.userIds, bookingsPerUser);

    if (!bookingsResult.success) {
      console.warn('⚠️  Some bookings failed to create');
    }

    console.log(`✅ Created ${bookingsResult.bookingIds.length} bookings`);

    // Step 4: Get all bookings for review creation
    const allBookings = await getSeedBookings(usersResult.userIds);

    // Step 5: Create reviews
    console.log('⭐ Step 3: Creating reviews...');
    const reviewsResult = await createSeedReviews(allBookings, reviewPercentage);

    if (!reviewsResult.success) {
      console.warn('⚠️  Some reviews failed to create');
    }

    console.log(`✅ Created ${reviewsResult.reviewIds.length} reviews`);

    const message = `🎉 Review system seed completed successfully!\n👥 Users: ${usersResult.userIds.length}\n📅 Bookings: ${bookingsResult.bookingIds.length}\n⭐ Reviews: ${reviewsResult.reviewIds.length}`;
    console.log(message);

    return {
      success: true,
      message,
      stats: {
        users: usersResult.userIds.length,
        bookings: bookingsResult.bookingIds.length,
        reviews: reviewsResult.reviewIds.length,
      },
    };
  } catch (error) {
    console.error('❌ Error in seedReviewSystem:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        users: 0,
        bookings: 0,
        reviews: 0,
      },
    };
  }
}

/**
 * Clears all review system seed data
 */
export async function clearReviewSystem(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log('🧹 Clearing review system data...');

    // Get regular user IDs
    const userIds = await getRegularUserIds();

    if (userIds.length === 0) {
      console.log('ℹ️  No regular users found to clear');
      return {
        success: true,
        message: 'No review system data found to clear',
      };
    }

    // Clear in reverse order (reviews -> bookings -> users)
    console.log('🗑️  Clearing reviews...');
    await clearSeedReviews(userIds);

    console.log('🗑️  Clearing bookings...');
    await clearSeedBookings(userIds);

    console.log('🗑️  Clearing users...');
    await clearRegularUsers();

    const message = `✅ Review system data cleared successfully`;
    console.log(message);

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error('❌ Error clearing review system:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gets statistics about the review system
 */
export async function getReviewSystemStats(): Promise<{
  users: number;
  bookings: number;
  reviews: number;
  averageRating: number;
  bookingsByUser: number;
  reviewsByBooking: number;
}> {
  try {
    console.log('📊 Getting review system statistics...');

    // Get regular user IDs
    const userIds = await getRegularUserIds();

    // Get bookings
    const bookingIds = await getSeedBookings(userIds);

    // Get reviews
    const reviewIds = await getSeedReviews(userIds);

    // Get average rating
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .in('id', reviewIds);

    if (reviewsError) {
      throw reviewsError;
    }

    const averageRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const stats = {
      users: userIds.length,
      bookings: bookingIds.length,
      reviews: reviewIds.length,
      averageRating: Math.round(averageRating * 10) / 10,
      bookingsByUser:
        userIds.length > 0 ? Math.round((bookingIds.length / userIds.length) * 10) / 10 : 0,
      reviewsByBooking:
        bookingIds.length > 0 ? Math.round((reviewIds.length / bookingIds.length) * 100) / 100 : 0,
    };

    console.log('📊 Review System Statistics:');
    console.log(`  Users: ${stats.users}`);
    console.log(`  Bookings: ${stats.bookings}`);
    console.log(`  Reviews: ${stats.reviews}`);
    console.log(`  Average Rating: ${stats.averageRating}`);
    console.log(`  Bookings per User: ${stats.bookingsByUser}`);
    console.log(`  Reviews per Booking: ${stats.reviewsByBooking}`);

    return stats;
  } catch (error) {
    console.error('❌ Error getting review system stats:', error);
    return {
      users: 0,
      bookings: 0,
      reviews: 0,
      averageRating: 0,
      bookingsByUser: 0,
      reviewsByBooking: 0,
    };
  }
}

/**
 * Gets detailed information about the review system
 */
export async function getReviewSystemDetails(): Promise<{
  users: Array<{ id: string; name: string; bookings: number; reviews: number }>;
  spaces: Array<{ id: string; title: string; reviews: number; averageRating: number }>;
  bookings: Array<{ id: string; user: string; space: string; date: string; hasReview: boolean }>;
}> {
  try {
    console.log('📋 Getting review system details...');

    // Get regular user IDs
    const userIds = await getRegularUserIds();

    // Get user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .in('user_id', userIds);

    if (profilesError) {
      throw profilesError;
    }

    // Get bookings
    const bookingIds = await getSeedBookings(userIds);
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, user_id, space_id, start_date, spaces(title)')
      .in('id', bookingIds);

    if (bookingsError) {
      throw bookingsError;
    }

    // Get reviews
    const reviewIds = await getSeedReviews(userIds);
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, user_id, space_id, booking_id, rating, spaces(title)')
      .in('id', reviewIds);

    if (reviewsError) {
      throw reviewsError;
    }

    // Build user details
    const users = (profiles || []).map((profile) => {
      const userBookings = bookings?.filter((b) => b.user_id === profile.user_id) || [];
      const userReviews = reviews?.filter((r) => r.user_id === profile.user_id) || [];

      return {
        id: profile.user_id,
        name: profile.full_name || 'Unknown',
        bookings: userBookings.length,
        reviews: userReviews.length,
      };
    });

    // Build space details
    const spaceMap = new Map<string, { title: string; reviews: number[] }>();
    (reviews || []).forEach((review) => {
      const spaceId = review.space_id;
      const spaceTitle = (review.spaces as { title: string })?.title || 'Unknown';
      if (!spaceMap.has(spaceId)) {
        spaceMap.set(spaceId, { title: spaceTitle, reviews: [] });
      }
      spaceMap.get(spaceId)!.reviews.push(review.rating);
    });

    const spaces = Array.from(spaceMap.entries()).map(([id, data]) => {
      const averageRating =
        data.reviews.length > 0
          ? data.reviews.reduce((sum, r) => sum + r, 0) / data.reviews.length
          : 0;

      return {
        id,
        title: data.title,
        reviews: data.reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    });

    // Build booking details
    const bookingDetails = (bookings || []).map((booking) => {
      const user = profiles?.find((p) => p.user_id === booking.user_id);
      const space = (booking.spaces as { title: string })?.title || 'Unknown';
      const hasReview = reviews?.some((r) => r.booking_id === booking.id) || false;

      return {
        id: booking.id,
        user: user?.full_name || 'Unknown',
        space,
        date: booking.start_date,
        hasReview,
      };
    });

    return {
      users,
      spaces,
      bookings: bookingDetails,
    };
  } catch (error) {
    console.error('❌ Error getting review system details:', error);
    return {
      users: [],
      spaces: [],
      bookings: [],
    };
  }
}
