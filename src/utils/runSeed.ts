/**
 * Helper script to seed the database with sample data
 *
 * Usage:
 * 1. Import and call this function from the browser console or from a component
 * 2. Make sure you're authenticated first
 *
 * Example:
 * ```typescript
 * import { runFullSeed } from '@/utils/runSeed';
 * runFullSeed();
 * ```
 */

import { generateSeedSpaces, clearAllSpaces, AMENITIES_LIST } from './seedSpaces';
import { createSeedData } from './seedData';
import { seedHostProfiles, clearHostProfiles, getHostProfileStats } from './seedHostProfiles';
import { createHostUsers, clearHostUsers, getHostUserIds, getHostUserStats } from './seedHostUsers';
import {
  markSpaceOwnersAsHosts,
  markNonOwnersAsNonHosts,
  fixAllHostData,
  getHostDataConsistency,
} from './fixHostData';
import {
  seedReviewSystem,
  clearReviewSystem,
  getReviewSystemStats,
  getReviewSystemDetails,
} from './seedReviewsSystem';
import {
  createRegularUsers,
  clearRegularUsers,
  getRegularUserIds,
  getRegularUserStats,
} from './seedRegularUsers';
import { createSeedBookings, getSeedBookings, clearSeedBookings } from './seedBookings';
import { createSeedReviews, getSeedReviews, clearSeedReviews } from './seedReviews';
import { supabase } from '@/integrations/supabase/client';

export interface SeedOptions {
  clearExisting?: boolean;
  generateMultipleSpaces?: boolean;
  spaceCount?: number;
}

/**
 * Run a full seed of the database
 * @param options - Seeding options
 */
export const runFullSeed = async (options: SeedOptions = {}) => {
  const { clearExisting = false, generateMultipleSpaces = true } = options;

  try {
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ User not authenticated. Please login first.');
      return;
    }

    console.log('🌱 Starting seed process...');
    console.log(`👤 User ID: ${user.id}`);

    // Optional: Clear existing spaces
    if (clearExisting) {
      console.log('🗑️  Clearing existing spaces...');
      await clearAllSpaces();
      console.log('✅ Existing spaces cleared');
    }

    // Generate initial sample spaces for the user
    console.log('📦 Creating initial sample spaces...');
    await createSeedData();
    console.log('✅ Initial sample spaces created');

    // Optional: Generate multiple spaces across different cities
    if (generateMultipleSpaces) {
      console.log('🏢 Generating multiple spaces across cities...');
      const spaces = await generateSeedSpaces([user.id]);
      console.log(`✅ Generated ${spaces?.length || 0} additional spaces`);
    }

    console.log('🎉 Seed process completed successfully!');
    console.log('📊 You can now explore the spaces in the application');

    return { success: true };
  } catch (error) {
    console.error('❌ Error during seed process:', error);
    return { success: false, error };
  }
};

/**
 * Run full seed with multiple hosts
 * Creates 23 host users, adds current user to the list, and distributes spaces equitably
 */
export const runFullSeedWithHosts = async (options: SeedOptions = {}) => {
  const { clearExisting = false } = options;

  try {
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ User not authenticated. Please login first.');
      return { success: false, error: 'User not authenticated' };
    }

    console.log('🌱 Starting full seed with hosts...');
    console.log(`👤 Current User ID: ${user.id}`);

    // Optional: Clear existing data
    if (clearExisting) {
      console.log('🗑️  Clearing existing spaces...');
      await clearAllSpaces();
      console.log('✅ Existing spaces cleared');
    }

    // Step 1: Create 23 host users
    console.log('📦 Step 1: Creating 23 host users...');
    const hostUsersResult = await createHostUsers();

    if (!hostUsersResult.success || hostUsersResult.userIds.length === 0) {
      console.error('❌ Failed to create host users');
      return { success: false, error: 'Failed to create host users' };
    }

    console.log(`✅ Created/found ${hostUsersResult.userIds.length} host users`);

    // Step 2: Add current user to host list (24 hosts total)
    const allHostIds = [...hostUsersResult.userIds, user.id];
    console.log(`👥 Total hosts (including current user): ${allHostIds.length}`);

    // Step 3: Generate initial sample spaces distributed among hosts
    console.log('📦 Step 2: Creating initial sample spaces...');
    await createSeedData(allHostIds);
    console.log('✅ Initial sample spaces created');

    // Step 4: Generate bulk spaces distributed among all hosts
    console.log('📦 Step 3: Generating bulk spaces across cities...');
    const spaces = await generateSeedSpaces(allHostIds);
    console.log(`✅ Generated ${spaces?.length || 0} additional spaces`);

    // Step 5: Apply host profile data to all hosts
    console.log('📦 Step 4: Applying host profile data...');
    const profileResult = await seedHostProfiles(allHostIds);
    console.log(`✅ ${profileResult.message}`);

    // Step 6: Ensure all space owners are marked as hosts
    console.log('📦 Step 5: Verifying is_host field consistency...');
    const fixResult = await markSpaceOwnersAsHosts();
    console.log(`✅ ${fixResult.message}`);

    const totalSpaces = (spaces?.length || 0) + 3; // 3 from initial seed
    const message = `🎉 Full seed with hosts completed successfully!\n👥 Hosts: ${allHostIds.length}\n🏢 Total Spaces: ${totalSpaces}\n📊 ~${Math.floor(totalSpaces / allHostIds.length)} spaces per host`;
    console.log(message);

    return {
      success: true,
      stats: {
        hosts: allHostIds.length,
        spaces: totalSpaces,
        spacesPerHost: Math.floor(totalSpaces / allHostIds.length),
      },
    };
  } catch (error) {
    console.error('❌ Error during seed process with hosts:', error);
    return { success: false, error };
  }
};

/**
 * Run seed for initial user data only (3 spaces)
 */
export const runBasicSeed = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ User not authenticated. Please login first.');
      return;
    }

    console.log('🌱 Creating basic sample spaces...');
    await createSeedData();
    console.log('✅ Basic seed completed!');

    return { success: true };
  } catch (error) {
    console.error('❌ Error during basic seed:', error);
    return { success: false, error };
  }
};

/**
 * Run seed for multiple spaces across cities (55 spaces)
 * @param hostIds - Optional array of host IDs to distribute spaces among
 */
export const runBulkSeed = async (hostIds?: string[]) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ User not authenticated. Please login first.');
      return { success: false, error: 'User not authenticated' };
    }

    const ownerIds = hostIds && hostIds.length > 0 ? hostIds : [user.id];

    console.log('🌱 Generating bulk spaces...');
    console.log(`📊 Distributing among ${ownerIds.length} host(s)`);
    const spaces = await generateSeedSpaces(ownerIds);
    console.log(`✅ Generated ${spaces?.length || 0} spaces across multiple cities`);

    return { success: true, count: spaces?.length };
  } catch (error) {
    console.error('❌ Error during bulk seed:', error);
    return { success: false, error };
  }
};

/**
 * Clear all spaces from the database
 */
export const clearSpaces = async () => {
  try {
    console.log('🗑️  Clearing all spaces...');
    await clearAllSpaces();
    console.log('✅ All spaces cleared');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing spaces:', error);
    return { success: false, error };
  }
};

/**
 * Get statistics about current spaces
 */
export const getSpaceStats = async () => {
  try {
    const { data: spaces, error } = await supabase
      .from('spaces')
      .select('id, city, category_id, is_active');

    if (error) throw error;

    const stats = {
      total: spaces?.length || 0,
      active: spaces?.filter((s) => s.is_active).length || 0,
      byCity:
        spaces?.reduce(
          (acc, space) => {
            acc[space.city] = (acc[space.city] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ) || {},
    };

    console.log('📊 Space Statistics:');
    console.log(`  Total Spaces: ${stats.total}`);
    console.log(`  Active Spaces: ${stats.active}`);
    console.log('  By City:', stats.byCity);

    return stats;
  } catch (error) {
    console.error('❌ Error getting space stats:', error);
    return null;
  }
};

/**
 * Display available amenities
 */
export const showAvailableAmenities = () => {
  console.log('🏷️  Available Amenities:');
  AMENITIES_LIST.forEach((amenity, index) => {
    console.log(`  ${index + 1}. ${amenity}`);
  });
  return AMENITIES_LIST;
};

/**
 * Seed host profile data for existing space owners
 */
export const seedHostData = async () => {
  try {
    console.log('🌱 Seeding host profiles...');
    const result = await seedHostProfiles();
    return result;
  } catch (error) {
    console.error('❌ Error seeding host profiles:', error);
    return { success: false, error };
  }
};

/**
 * Clear all host profile data
 */
export const clearHostData = async () => {
  try {
    console.log('🗑️  Clearing host profiles...');
    const result = await clearHostProfiles();
    return result;
  } catch (error) {
    console.error('❌ Error clearing host profiles:', error);
    return { success: false, error };
  }
};

/**
 * Get statistics about host profiles
 */
export const getHostStats = async () => {
  try {
    const stats = await getHostProfileStats();
    return stats;
  } catch (error) {
    console.error('❌ Error getting host stats:', error);
    return null;
  }
};

/**
 * Create host users (23 users with authentication)
 */
export const createHosts = async () => {
  try {
    console.log('🌱 Creating host users...');
    const result = await createHostUsers();
    return result;
  } catch (error) {
    console.error('❌ Error creating host users:', error);
    return {
      success: false,
      error,
      userIds: [],
      message: 'Failed to create hosts',
      stats: { created: 0, existing: 0, failed: 0 },
    };
  }
};

/**
 * Clear all host-related data (host users and profiles)
 */
export const clearAllHostData = async () => {
  try {
    console.log('🗑️  Clearing all host data...');

    // Clear host profiles first
    const profileResult = await clearHostProfiles();
    console.log(`✅ ${profileResult.message}`);

    // Clear host users
    const userResult = await clearHostUsers();
    console.log(`✅ ${userResult.message}`);

    return {
      success: true,
      message: 'All host data cleared successfully',
    };
  } catch (error) {
    console.error('❌ Error clearing host data:', error);
    return { success: false, error };
  }
};

/**
 * Get all host user IDs
 */
export const getHostIds = async () => {
  try {
    const hostIds = await getHostUserIds();
    console.log(`📊 Found ${hostIds.length} host users`);
    return hostIds;
  } catch (error) {
    console.error('❌ Error getting host IDs:', error);
    return [];
  }
};

/**
 * Get statistics about host users
 */
export const getHostUserStatistics = async () => {
  try {
    const stats = await getHostUserStats();
    return stats;
  } catch (error) {
    console.error('❌ Error getting host user stats:', error);
    return null;
  }
};

// Export all functions for easy access
export const seedUtils = {
  // Main seeding functions
  runFullSeed,
  runFullSeedWithHosts,
  runBasicSeed,
  runBulkSeed,

  // Space management
  clearSpaces,
  getSpaceStats,
  showAvailableAmenities,

  // Host profile management
  seedHostData,
  clearHostData,
  getHostStats,

  // Host user management
  createHosts,
  clearAllHostData,
  getHostIds,
  getHostUserStatistics,

  // Host data correction utilities
  fixAllHostData,
  markSpaceOwnersAsHosts,
  markNonOwnersAsNonHosts,
  getHostDataConsistency,

  // Review system management
  seedReviewSystem,
  clearReviewSystem,
  getReviewSystemStats,
  getReviewSystemDetails,

  // Regular user management
  createRegularUsers,
  clearRegularUsers,
  getRegularUserIds,
  getRegularUserStats,

  // Booking management
  createSeedBookings,
  getSeedBookings,
  clearSeedBookings,

  // Review management
  createSeedReviews,
  getSeedReviews,
  clearSeedReviews,
};

// Make it available in the browser console for development
if (globalThis.window !== undefined) {
  (globalThis.window as unknown as { seedUtils?: typeof seedUtils }).seedUtils = seedUtils;
  console.log('💡 Seed utilities available in console as: window.seedUtils');
}
