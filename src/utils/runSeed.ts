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
      const spaces = await generateSeedSpaces(user.id);
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
 */
export const runBulkSeed = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ User not authenticated. Please login first.');
      return;
    }

    console.log('🌱 Generating bulk spaces...');
    const spaces = await generateSeedSpaces(user.id);
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

// Export all functions for easy access
export const seedUtils = {
  runFullSeed,
  runBasicSeed,
  runBulkSeed,
  clearSpaces,
  getSpaceStats,
  showAvailableAmenities,
};

// Make it available in the browser console for development
if (globalThis.window !== undefined) {
  (globalThis.window as unknown as { seedUtils?: typeof seedUtils }).seedUtils = seedUtils;
  console.log('💡 Seed utilities available in console as: window.seedUtils');
}
