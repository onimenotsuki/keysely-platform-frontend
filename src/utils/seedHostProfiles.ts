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
  is_host: boolean;
}

const hostProfilesData: HostProfileData[] = [
  {
    languages: ['Español', 'English'],
    response_rate: 98,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Gerente de propiedades comerciales especializado en espacios de coworking',
    is_host: true,
  },
  {
    languages: ['Español', 'English', 'Français'],
    response_rate: 95,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Arquitecto y diseñador de interiores con 10 años de experiencia',
    is_host: true,
  },
  {
    languages: ['Español'],
    response_rate: 92,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Emprendedor y fundador de startup tecnológica',
    is_host: true,
  },
  {
    languages: ['English', 'Español'],
    response_rate: 100,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Consultor de negocios y facilitador de espacios colaborativos',
    is_host: true,
  },
  {
    languages: ['Español', 'Português'],
    response_rate: 89,
    response_time_hours: 4,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Diseñador gráfico freelance',
    is_host: true,
  },
  {
    languages: ['Español', 'English', 'Deutsch'],
    response_rate: 97,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Director de operaciones en empresa de bienes raíces',
    is_host: true,
  },
  {
    languages: ['English'],
    response_rate: 94,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Digital nomad y community manager',
    is_host: true,
  },
  {
    languages: ['Español', 'English', 'Italiano'],
    response_rate: 96,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Chef ejecutivo y propietario de restaurante',
    is_host: true,
  },
  {
    languages: ['Español'],
    response_rate: 88,
    response_time_hours: 5,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Desarrollador de software y tech enthusiast',
    is_host: true,
  },
  {
    languages: ['Español', 'English'],
    response_rate: 99,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Inversor inmobiliario con portfolio de 15+ propiedades',
    is_host: true,
  },
  {
    languages: ['English', 'Español', '中文'],
    response_rate: 91,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Consultor internacional y speaker motivacional',
    is_host: true,
  },
  {
    languages: ['Español'],
    response_rate: 85,
    response_time_hours: 6,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Artista visual y creador de contenido',
    is_host: true,
  },
  {
    languages: ['Español', 'English'],
    response_rate: 93,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Abogado corporativo especializado en startups',
    is_host: true,
  },
  {
    languages: ['English', 'Español', '日本語'],
    response_rate: 100,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Entrepreneur y mentor de negocios internacionales',
    is_host: true,
  },
  {
    languages: ['Español', 'Català'],
    response_rate: 90,
    response_time_hours: 4,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Fotógrafo profesional y productor audiovisual',
    is_host: true,
  },
  {
    languages: ['Español', 'English'],
    response_rate: 87,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Coach de negocios y facilitador organizacional',
    is_host: true,
  },
  {
    languages: ['Español'],
    response_rate: 95,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Ingeniero civil especializado en construcción sustentable',
    is_host: true,
  },
  {
    languages: ['English', 'Español', 'العربية'],
    response_rate: 92,
    response_time_hours: 4,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Consultor de tecnología y transformación digital',
    is_host: true,
  },
  {
    languages: ['Español', 'English'],
    response_rate: 96,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Diseñadora de experiencias y estratega de marca',
    is_host: true,
  },
  {
    languages: ['Español'],
    response_rate: 84,
    response_time_hours: 5,
    is_identity_verified: false,
    is_superhost: false,
    work_description: 'Músico profesional y productor musical',
    is_host: true,
  },
  {
    languages: ['Español', 'English', '한국어'],
    response_rate: 98,
    response_time_hours: 1,
    is_identity_verified: true,
    is_superhost: true,
    work_description: 'Director creativo en agencia de publicidad',
    is_host: true,
  },
  {
    languages: ['English', 'Español'],
    response_rate: 90,
    response_time_hours: 3,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Psicólogo organizacional y coach ejecutivo',
    is_host: true,
  },
  {
    languages: ['Español', 'English', 'Русский'],
    response_rate: 93,
    response_time_hours: 2,
    is_identity_verified: true,
    is_superhost: false,
    work_description: 'Contador público y asesor financiero',
    is_host: true,
  },
];

/**
 * Seeds host profile data for specific user IDs or existing space owners
 * @param userIds - Optional array of user IDs to apply host profiles to. If not provided, uses space owners.
 */
export async function seedHostProfiles(userIds?: string[]) {
  try {
    console.log('🌱 Starting host profiles seeding...');

    let targetUserIds: string[];

    if (userIds && userIds.length > 0) {
      // Use provided user IDs
      targetUserIds = userIds;
      console.log(`📊 Using ${targetUserIds.length} provided user IDs`);
    } else {
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
      targetUserIds = [...new Set(spaceOwners.map((s) => s.owner_id))];
      console.log(`📊 Found ${targetUserIds.length} unique space owners`);
    }

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each user's profile with host data
    for (let i = 0; i < targetUserIds.length; i++) {
      const userId = targetUserIds[i];
      const hostData = hostProfilesData[i % hostProfilesData.length];

      // Check if profile already has host data
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('languages, is_superhost, is_host')
        .eq('user_id', userId)
        .single();

      // Skip if already has host data
      if (
        existingProfile?.languages &&
        existingProfile.languages.length > 0 &&
        existingProfile.is_superhost !== null &&
        existingProfile.is_host === true
      ) {
        skippedCount++;
        continue;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(hostData)
        .eq('user_id', userId);

      if (updateError) {
        console.error(`❌ Error updating profile for ${userId}:`, updateError.message);
      } else {
        updatedCount++;
        console.log(`✅ Updated host profile ${updatedCount}/${targetUserIds.length}`);
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
        total: targetUserIds.length,
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
        is_host: false,
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
      .select('languages, is_superhost, is_identity_verified, response_rate, is_host');

    if (error) throw error;

    const withLanguages =
      profiles?.filter((p) => p.languages && p.languages.length > 0).length || 0;
    const superhosts = profiles?.filter((p) => p.is_superhost).length || 0;
    const verified = profiles?.filter((p) => p.is_identity_verified).length || 0;
    const withResponseRate = profiles?.filter((p) => p.response_rate !== null).length || 0;
    const hosts = profiles?.filter((p) => p.is_host).length || 0;

    const stats = {
      total: profiles?.length || 0,
      hosts,
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
