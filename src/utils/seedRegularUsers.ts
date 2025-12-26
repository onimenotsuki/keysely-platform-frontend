import { supabase } from '@/integrations/supabase/client';

/**
 * Seed data for creating regular users (non-hosts) with authentication
 * This script creates 10 regular users with realistic Spanish names
 */

const REGULAR_USER_PASSWORD = 'UserPassword123!';
const REGULAR_USER_EMAIL_DOMAIN = '@keysely.dev';

const regularUserNames = [
  'Fernando López Martínez',
  'Sofía Ramírez García',
  'Diego Hernández Pérez',
  'Valeria Sánchez Rodríguez',
  'Mateo González López',
  'Isabella Torres Martínez',
  'Sebastián Morales Díaz',
  'Emma Jiménez Ruiz',
  'Lucas Fernández Castro',
  'Olivia Vargas Herrera',
];

interface RegularUserResult {
  success: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

/**
 * Creates a single regular user with authentication
 */
async function createSingleRegularUser(
  email: string,
  fullName: string,
  index: number
): Promise<RegularUserResult> {
  try {
    // Check if user already exists by email or full name
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .eq('full_name', fullName)
      .single();

    if (existingProfile) {
      console.log(`⏭️  Regular user ${index + 1} already exists: ${fullName}`);
      return {
        success: true,
        userId: existingProfile.user_id,
        email,
      };
    }

    // Create user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: REGULAR_USER_PASSWORD,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      // Check if error is because user already exists
      if (signUpError.message.includes('already registered')) {
        // Try to get existing user
        const {
          data: { user },
        } = await supabase.auth.signInWithPassword({
          email,
          password: REGULAR_USER_PASSWORD,
        });

        if (user) {
          console.log(`✅ Regular user ${index + 1} already registered: ${fullName}`);
          await supabase.auth.signOut(); // Sign out immediately

          // Ensure user profile has is_host = false
          await supabase.from('profiles').update({ is_host: false }).eq('user_id', user.id);

          return {
            success: true,
            userId: user.id,
            email,
          };
        }
      }
      throw signUpError;
    }

    if (!authData.user) {
      throw new Error('User creation failed - no user returned');
    }

    // Ensure user profile has is_host = false
    await supabase.from('profiles').update({ is_host: false }).eq('user_id', authData.user.id);

    console.log(`✅ Created regular user ${index + 1}/${regularUserNames.length}: ${fullName}`);

    return {
      success: true,
      userId: authData.user.id,
      email,
    };
  } catch (error) {
    console.error(`❌ Error creating regular user ${fullName}:`, error);
    return {
      success: false,
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Creates 10 regular users (non-hosts) with authentication
 * @returns Array of created user IDs
 */
export async function createRegularUsers(): Promise<{
  success: boolean;
  userIds: string[];
  message: string;
  stats: {
    created: number;
    existing: number;
    failed: number;
  };
}> {
  try {
    console.log('🌱 Starting regular users creation...');
    console.log(`📧 Creating 10 regular users with domain ${REGULAR_USER_EMAIL_DOMAIN}`);
    console.log(`🔑 Default password: ${REGULAR_USER_PASSWORD}`);

    const results: RegularUserResult[] = [];
    let createdCount = 0;
    let existingCount = 0;
    let failedCount = 0;

    // Create each regular user
    for (let i = 0; i < regularUserNames.length; i++) {
      const email = `user${i + 1}${REGULAR_USER_EMAIL_DOMAIN}`;
      const fullName = regularUserNames[i];

      const result = await createSingleRegularUser(email, fullName, i);
      results.push(result);

      if (result.success) {
        if (result.error?.includes('already')) {
          existingCount++;
        } else {
          createdCount++;
        }
      } else {
        failedCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Extract successful user IDs
    const userIds = results.filter((r) => r.success && r.userId).map((r) => r.userId as string);

    const message = `✨ Regular users creation completed!\n📊 Created: ${createdCount}, Existing: ${existingCount}, Failed: ${failedCount}\n👥 Total user IDs: ${userIds.length}`;
    console.log(message);

    return {
      success: true,
      userIds,
      message,
      stats: {
        created: createdCount,
        existing: existingCount,
        failed: failedCount,
      },
    };
  } catch (error) {
    console.error('❌ Error in createRegularUsers:', error);
    return {
      success: false,
      userIds: [],
      message: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        created: 0,
        existing: 0,
        failed: 0,
      },
    };
  }
}

/**
 * Deletes all test regular users (users with @keysely.dev domain and matching names)
 * Note: This requires admin privileges and may not work with client-side SDK
 */
export async function clearRegularUsers(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log('🧹 Clearing regular users...');
    console.log('⚠️  This will clear profile data for regular users with @keysely.dev domain');

    // Get all profiles of regular users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .in('full_name', regularUserNames);

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length === 0) {
      console.log('ℹ️  No regular users found to delete');
      return { success: true, message: 'No regular users found' };
    }

    console.log(`📊 Found ${profiles.length} regular users to clear`);

    // Clear their profile data
    const { error: clearError } = await supabase
      .from('profiles')
      .update({
        is_host: false,
        languages: [],
        response_rate: null,
        response_time_hours: null,
        is_identity_verified: false,
        is_superhost: false,
        work_description: null,
      })
      .in(
        'user_id',
        profiles.map((p) => p.user_id)
      );

    if (clearError) throw clearError;

    // Delete their bookings
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .in(
        'user_id',
        profiles.map((p) => p.user_id)
      );

    if (bookingsError) {
      console.warn('⚠️  Error deleting bookings:', bookingsError);
    }

    // Delete their reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .in(
        'user_id',
        profiles.map((p) => p.user_id)
      );

    if (reviewsError) {
      console.warn('⚠️  Error deleting reviews:', reviewsError);
    }

    const message = `✅ Cleared regular user data for ${profiles.length} users\n⚠️  Note: Auth users not deleted (requires admin privileges)`;
    console.log(message);

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error('❌ Error clearing regular users:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gets list of all regular user IDs
 */
export async function getRegularUserIds(): Promise<string[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id')
      .in('full_name', regularUserNames)
      .eq('is_host', false);

    if (error) throw error;

    return profiles?.map((p) => p.user_id) || [];
  } catch (error) {
    console.error('❌ Error getting regular user IDs:', error);
    return [];
  }
}

/**
 * Gets statistics about regular users
 */
export async function getRegularUserStats() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, is_host')
      .in('full_name', regularUserNames);

    if (error) throw error;

    const stats = {
      total: profiles?.length || 0,
      isHost: profiles?.filter((p) => p.is_host).length || 0,
      isRegular: profiles?.filter((p) => !p.is_host).length || 0,
    };

    console.log('📊 Regular User Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error getting regular user stats:', error);
    return null;
  }
}
