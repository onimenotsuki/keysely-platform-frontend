import { supabase } from '@/integrations/supabase/client';

/**
 * Seed data for creating host users with authentication
 * This script creates 23 host users with realistic Spanish names
 */

const HOST_PASSWORD = 'HostPassword123!';
const HOST_EMAIL_DOMAIN = '@keysely.dev';

const hostNames = [
  'Carlos Rodríguez García',
  'María Elena Martínez López',
  'Juan Pablo Hernández Silva',
  'Ana Sofia González Ramírez',
  'Luis Fernando Torres Morales',
  'Carmen Patricia Flores Cruz',
  'Roberto Carlos Díaz Muñoz',
  'Isabel Cristina Ruiz Ortiz',
  'Miguel Ángel Jiménez Castro',
  'Laura Victoria Sánchez Vargas',
  'Francisco Javier Romero Reyes',
  'Gabriela Alejandra Gutiérrez Pérez',
  'Diego Armando Medina Ríos',
  'Valentina Andrea Castro Mendoza',
  'Andrés Felipe Rivera Herrera',
  'Daniela Fernanda Moreno Aguilar',
  'Santiago José Ramos Delgado',
  'Natalia Carolina Vega Cortés',
  'Eduardo Alberto Guerrero Rojas',
  'Camila Sofía Campos Navarro',
  'Ricardo Daniel Fuentes Salazar',
  'Paola Andrea Núñez Domínguez',
  'Alejandro Manuel Cabrera Zamora',
];

interface HostUserResult {
  success: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

/**
 * Creates a single host user with authentication
 */
async function createSingleHostUser(
  email: string,
  fullName: string,
  index: number
): Promise<HostUserResult> {
  try {
    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('full_name', fullName)
      .single();

    if (existingProfile) {
      console.log(`⏭️  Host ${index + 1} already exists: ${fullName}`);
      return {
        success: true,
        userId: existingProfile.user_id,
        email,
      };
    }

    // Create user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: HOST_PASSWORD,
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
          password: HOST_PASSWORD,
        });

        if (user) {
          console.log(`✅ Host ${index + 1} already registered: ${fullName}`);
          await supabase.auth.signOut(); // Sign out immediately
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

    console.log(`✅ Created host ${index + 1}/${hostNames.length}: ${fullName}`);

    return {
      success: true,
      userId: authData.user.id,
      email,
    };
  } catch (error) {
    console.error(`❌ Error creating host user ${fullName}:`, error);
    return {
      success: false,
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Creates 23 host users with authentication
 * @returns Array of created user IDs
 */
export async function createHostUsers(): Promise<{
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
    console.log('🌱 Starting host users creation...');
    console.log(`📧 Creating 23 host users with domain ${HOST_EMAIL_DOMAIN}`);
    console.log(`🔑 Default password: ${HOST_PASSWORD}`);

    const results: HostUserResult[] = [];
    let createdCount = 0;
    let existingCount = 0;
    let failedCount = 0;

    // Create each host user
    for (let i = 0; i < hostNames.length; i++) {
      const email = `host${i + 1}${HOST_EMAIL_DOMAIN}`;
      const fullName = hostNames[i];

      const result = await createSingleHostUser(email, fullName, i);
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

    const message = `✨ Host users creation completed!\n📊 Created: ${createdCount}, Existing: ${existingCount}, Failed: ${failedCount}\n👥 Total host IDs: ${userIds.length}`;
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
    console.error('❌ Error in createHostUsers:', error);
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
 * Deletes all test host users (users with @keysely.dev domain)
 * Note: This requires admin privileges and may not work with client-side SDK
 */
export async function clearHostUsers(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log('🧹 Clearing host users...');
    console.log('⚠️  This will delete all users with @keysely.dev domain');

    // Get all profiles of host users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .in('full_name', hostNames);

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length === 0) {
      console.log('ℹ️  No host users found to delete');
      return { success: true, message: 'No host users found' };
    }

    console.log(`📊 Found ${profiles.length} host users to delete`);

    // Note: Deleting auth users requires admin privileges
    // For now, we'll just clear their host profile data
    const { error: clearError } = await supabase
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
      .in(
        'user_id',
        profiles.map((p) => p.user_id)
      );

    if (clearError) throw clearError;

    const message = `✅ Cleared host profile data for ${profiles.length} users\n⚠️  Note: Auth users not deleted (requires admin privileges)`;
    console.log(message);

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error('❌ Error clearing host users:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gets list of all host user IDs
 */
export async function getHostUserIds(): Promise<string[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('is_host', true);

    if (error) throw error;

    return profiles?.map((p) => p.user_id) || [];
  } catch (error) {
    console.error('❌ Error getting host user IDs:', error);
    return [];
  }
}

/**
 * Gets statistics about host users
 */
export async function getHostUserStats() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, is_host')
      .in('full_name', hostNames);

    if (error) throw error;

    const stats = {
      total: profiles?.length || 0,
      hosts: profiles?.filter((p) => p.is_host).length || 0,
      nonHosts: profiles?.filter((p) => !p.is_host).length || 0,
    };

    console.log('📊 Host User Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error getting host user stats:', error);
    return null;
  }
}
