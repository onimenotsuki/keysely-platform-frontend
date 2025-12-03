import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions to fix host data
 * These functions help correct is_host field for existing users
 */

/**
 * Marks all users who own spaces as hosts
 * This corrects any inconsistencies in the database
 */
export async function markSpaceOwnersAsHosts() {
  try {
    console.log('🔧 Fixing host data: marking space owners as hosts...');

    // Get all unique space owners
    const { data: spaces, error: spacesError } = await supabase.from('spaces').select('owner_id');

    if (spacesError) throw spacesError;

    if (!spaces || spaces.length === 0) {
      console.log('ℹ️  No spaces found');
      return { success: true, updated: 0, message: 'No spaces found' };
    }

    // Get unique owner IDs
    const uniqueOwnerIds = [...new Set(spaces.map((s) => s.owner_id))];
    console.log(`📊 Found ${uniqueOwnerIds.length} unique space owners`);

    // Update all these users to be hosts
    const { error: updateError, count } = await supabase
      .from('profiles')
      .update({ is_host: true })
      .in('user_id', uniqueOwnerIds)
      .not('is_host', 'eq', true); // Only update if not already true

    if (updateError) throw updateError;

    const message = `✅ Successfully marked ${count || 0} users as hosts`;
    console.log(message);

    return {
      success: true,
      updated: count || 0,
      message,
      totalOwners: uniqueOwnerIds.length,
    };
  } catch (error) {
    console.error('❌ Error marking space owners as hosts:', error);
    return {
      success: false,
      updated: 0,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Marks users who don't own any spaces as non-hosts
 * This helps clean up any incorrect host flags
 */
export async function markNonOwnersAsNonHosts() {
  try {
    console.log('🔧 Fixing host data: unmarking users without spaces...');

    // Get all unique space owners
    const { data: spaces, error: spacesError } = await supabase.from('spaces').select('owner_id');

    if (spacesError) throw spacesError;

    const ownerIds = spaces ? [...new Set(spaces.map((s) => s.owner_id))] : [];

    // Update users who are marked as hosts but don't own any spaces
    const { error: updateError, count } = await supabase
      .from('profiles')
      .update({ is_host: false })
      .eq('is_host', true)
      .not('user_id', 'in', `(${ownerIds.map((id) => `'${id}'`).join(',')})`);

    if (updateError) throw updateError;

    const message = `✅ Successfully unmarked ${count || 0} users who don't own spaces`;
    console.log(message);

    return {
      success: true,
      updated: count || 0,
      message,
    };
  } catch (error) {
    console.error('❌ Error unmarking non-owners:', error);
    return {
      success: false,
      updated: 0,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Comprehensive fix: ensures is_host field is accurate for all users
 */
export async function fixAllHostData() {
  try {
    console.log('🔧 Running comprehensive host data fix...');

    // Step 1: Mark space owners as hosts
    const ownersResult = await markSpaceOwnersAsHosts();
    console.log(`✅ Step 1: ${ownersResult.message}`);

    // Step 2: Unmark non-owners
    const nonOwnersResult = await markNonOwnersAsNonHosts();
    console.log(`✅ Step 2: ${nonOwnersResult.message}`);

    const message = `🎉 Host data fix completed!\n📊 Marked as hosts: ${ownersResult.updated}\n📊 Unmarked: ${nonOwnersResult.updated}`;
    console.log(message);

    return {
      success: true,
      message,
      stats: {
        markedAsHosts: ownersResult.updated,
        unmarked: nonOwnersResult.updated,
      },
    };
  } catch (error) {
    console.error('❌ Error fixing host data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        markedAsHosts: 0,
        unmarked: 0,
      },
    };
  }
}

/**
 * Gets statistics about host data consistency
 */
export async function getHostDataConsistency() {
  try {
    console.log('📊 Checking host data consistency...');

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, is_host');

    if (profilesError) throw profilesError;

    // Get all space owners
    const { data: spaces, error: spacesError } = await supabase.from('spaces').select('owner_id');

    if (spacesError) throw spacesError;

    const ownerIds = new Set(spaces?.map((s) => s.owner_id) || []);
    const markedAsHosts = profiles?.filter((p) => p.is_host === true) || [];
    const shouldBeHosts = profiles?.filter((p) => ownerIds.has(p.user_id)) || [];
    const incorrectlyMarked = markedAsHosts.filter((p) => !ownerIds.has(p.user_id));
    const incorrectlyUnmarked = shouldBeHosts.filter((p) => p.is_host !== true);

    const stats = {
      totalUsers: profiles?.length || 0,
      totalSpaceOwners: ownerIds.size,
      markedAsHosts: markedAsHosts.length,
      shouldBeHosts: shouldBeHosts.length,
      incorrectlyMarked: incorrectlyMarked.length,
      incorrectlyUnmarked: incorrectlyUnmarked.length,
      isConsistent: incorrectlyMarked.length === 0 && incorrectlyUnmarked.length === 0,
    };

    console.log('📊 Host Data Consistency Report:');
    console.log(`  Total Users: ${stats.totalUsers}`);
    console.log(`  Total Space Owners: ${stats.totalSpaceOwners}`);
    console.log(`  Marked as Hosts: ${stats.markedAsHosts}`);
    console.log(`  Should be Hosts: ${stats.shouldBeHosts}`);
    console.log(`  ❌ Incorrectly Marked: ${stats.incorrectlyMarked}`);
    console.log(`  ❌ Incorrectly Unmarked: ${stats.incorrectlyUnmarked}`);
    console.log(
      `  ${stats.isConsistent ? '✅' : '⚠️'} Data is ${stats.isConsistent ? 'consistent' : 'INCONSISTENT'}`
    );

    return stats;
  } catch (error) {
    console.error('❌ Error checking host data consistency:', error);
    return null;
  }
}
