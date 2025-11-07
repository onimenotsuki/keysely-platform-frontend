import { supabase } from '@/integrations/supabase/client';

/**
 * Seed data for host profiles
 * This script updates existing profiles with realistic host information
 */

interface HostProfileData {
  languages: string[];
  response_rate: number;
  response_time_hours: number;
  is_identity_verified: boolean;
  is_superhost: boolean;
  work_description: string;
}

const hostProfilesData: HostProfileData[] = [
  {
    languages: ['Español', 'English'],
    response_rate: 98,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Gerente de propiedades comerciales especializado en espacios de coworking',
  },
  {
    languages: ['Español', 'English', 'Français'],
    response_rate: 95,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Arquitecto y diseñador de interiores con 10 años de experiencia',
  },
  {
    languages: ['Español'],
    response_rate: 92,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Emprendedor y fundador de startup tecnológica',
  },
  {
    languages: ['English', 'Español'],
    response_rate: 100,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Consultor de negocios y facilitador de espacios colaborativos',
  },
  {
    languages: ['Español', 'Português'],
    response_rate: 89,
    response_time_hours: 4,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Diseñador gráfico freelance',
  },
  {
    languages: ['Español', 'English', 'Deutsch'],
    response_rate: 97,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Director de operaciones en empresa de bienes raíces',
  },
  {
    languages: ['English'],
    response_rate: 94,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Digital nomad y community manager',
  },
  {
    languages: ['Español', 'English', 'Italiano'],
    response_rate: 96,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Chef ejecutivo y propietario de restaurante',
  },
  {
    languages: ['Español'],
    response_rate: 88,
    response_time_hours: 5,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Desarrollador de software y tech enthusiast',
  },
  {
    languages: ['Español', 'English'],
    response_rate: 99,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Inversor inmobiliario con portfolio de 15+ propiedades',
  },
  {
    languages: ['English', 'Español', '中文'],
    response_rate: 91,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Consultor internacional y speaker motivacional',
  },
  {
    languages: ['Español'],
    response_rate: 85,
    response_time_hours: 6,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Artista visual y creador de contenido',
  },
  {
    languages: ['Español', 'English'],
    response_rate: 93,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Abogado corporativo especializado en startups',
  },
  {
    languages: ['English', 'Español', '日本語'],
    response_rate: 100,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Entrepreneur y mentor de negocios internacionales',
  },
  {
    languages: ['Español', 'Català'],
    response_rate: 90,
    response_time_hours: 4,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Fotógrafo profesional y productor audiovisual',
  },
];

/**
 * Seeds host profile data for existing users who own spaces
 */
export async function seedHostProfiles() {
  try {
    console.log('🌱 Starting host profiles seeding...');

    // Get all users who own at least one space
    const { data: spaceOwners, error: ownersError } = await supabase
      .from('spaces')
      .select('owner_id')
      .not('owner_id', 'is', null);

    if (ownersError) {
      throw ownersError;
    }

    if (!spaceOwners || spaceOwners.length === 0) {
      console.log('⚠️  No space owners found. Please seed spaces first.');
      return { success: false, message: 'No space owners found' };
    }

    // Get unique owner IDs
    const uniqueOwnerIds = [...new Set(spaceOwners.map((s) => s.owner_id))];
    console.log(`📊 Found ${uniqueOwnerIds.length} unique space owners`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each owner's profile with host data
    for (let i = 0; i < uniqueOwnerIds.length; i++) {
      const ownerId = uniqueOwnerIds[i];
      const hostData = hostProfilesData[i % hostProfilesData.length];

      // Check if profile already has host data
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('languages, is_superhost')
        .eq('user_id', ownerId)
        .single();

      // Skip if already has host data
      if (
        existingProfile?.languages &&
        existingProfile.languages.length > 0 &&
        existingProfile.is_superhost !== null
      ) {
        skippedCount++;
        continue;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(hostData)
        .eq('user_id', ownerId);

      if (updateError) {
        console.error(`❌ Error updating profile for ${ownerId}:`, updateError.message);
      } else {
        updatedCount++;
        console.log(`✅ Updated host profile ${updatedCount}/${uniqueOwnerIds.length}`);
      }
    }

    const message = `✨ Host profiles seeded successfully!\n📊 Updated: ${updatedCount}, Skipped: ${skippedCount}`;
    console.log(message);

    return {
      success: true,
      message,
      stats: {
        updated: updatedCount,
        skipped: skippedCount,
        total: uniqueOwnerIds.length,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding host profiles:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Clears host profile data from all profiles
 */
export async function clearHostProfiles() {
  try {
    console.log('🧹 Clearing host profiles...');

    const { error } = await supabase
      .from('profiles')
      .update({
        languages: [],
        response_rate: null,
        response_time_hours: null,
        is_identity_verified: false,
        is_superhost: false,
        work_description: null,
      })
      .not('languages', 'is', null);

    if (error) throw error;

    console.log('✅ Host profiles cleared successfully');
    return { success: true, message: 'Host profiles cleared' };
  } catch (error) {
    console.error('❌ Error clearing host profiles:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gets statistics about host profiles
 */
export async function getHostProfileStats() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('languages, is_superhost, is_identity_verified, response_rate');

    if (error) throw error;

    const withLanguages =
      profiles?.filter((p) => p.languages && p.languages.length > 0).length || 0;
    const superhosts = profiles?.filter((p) => p.is_superhost).length || 0;
    const verified = profiles?.filter((p) => p.is_identity_verified).length || 0;
    const withResponseRate = profiles?.filter((p) => p.response_rate !== null).length || 0;

    const stats = {
      total: profiles?.length || 0,
      withLanguages,
      superhosts,
      verified,
      withResponseRate,
    };

    console.log('📊 Host Profile Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error getting host profile stats:', error);
    return null;
  }
}
