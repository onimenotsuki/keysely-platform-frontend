import { supabase } from '@/integrations/supabase/client';

export const createSeedData = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if user already has spaces
    const { data: existingSpaces } = await supabase
      .from('spaces')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (existingSpaces && existingSpaces.length > 0) {
      console.log('User already has spaces, skipping seed data creation');
      return;
    }

    // Get categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');

    if (!categories || categories.length === 0) {
      console.log('No categories found');
      return;
    }

    const officeCategory = categories.find(c => c.name === 'Oficina Privada')?.id;
    const meetingCategory = categories.find(c => c.name === 'Sala de Reuniones')?.id;
    const coworkingCategory = categories.find(c => c.name === 'Coworking')?.id;

    // Create sample spaces for the current user
    const sampleSpaces = [
      {
        title: 'Mi Oficina Privada',
        description: 'Elegante oficina privada perfecta para equipos pequeños. Ubicada en una zona comercial con excelente conectividad.',
        address: 'Av. Principal 123',
        city: 'Ciudad de México',
        price_per_hour: 350.00,
        capacity: 6,
        area_sqm: 40,
        images: ['/placeholder.svg?height=400&width=600&text=Oficina+Principal'],
        features: ['Vista panorámica', 'Luz natural', 'Mobiliario moderno'],
        amenities: ['WiFi de alta velocidad', 'Aire acondicionado', 'Cafetera'],
        availability_hours: {
          "monday": {"start": "08:00", "end": "20:00"},
          "tuesday": {"start": "08:00", "end": "20:00"},
          "wednesday": {"start": "08:00", "end": "20:00"},
          "thursday": {"start": "08:00", "end": "20:00"},
          "friday": {"start": "08:00", "end": "20:00"}
        },
        policies: 'No se permite fumar. Política de cancelación: 24 horas de anticipación.',
        owner_id: user.id,
        category_id: officeCategory
      },
      {
        title: 'Sala de Reuniones Ejecutiva',
        description: 'Sala de reuniones equipada con tecnología de punta para presentaciones profesionales.',
        address: 'Calle Comercio 456',
        city: 'Ciudad de México',
        price_per_hour: 480.00,
        capacity: 10,
        area_sqm: 25,
        images: ['/placeholder.svg?height=400&width=600&text=Sala+Reuniones'],
        features: ['Mesa ejecutiva', 'Pantalla 4K', 'Sistema de audio'],
        amenities: ['WiFi empresarial', 'Proyector', 'Catering disponible'],
        availability_hours: {
          "monday": {"start": "07:00", "end": "22:00"},
          "tuesday": {"start": "07:00", "end": "22:00"},
          "wednesday": {"start": "07:00", "end": "22:00"},
          "thursday": {"start": "07:00", "end": "22:00"},
          "friday": {"start": "07:00", "end": "22:00"},
          "saturday": {"start": "08:00", "end": "18:00"}
        },
        policies: 'Reserva mínima de 2 horas. Incluye servicio básico de café.',
        owner_id: user.id,
        category_id: meetingCategory
      }
    ];

    // Insert sample spaces
    const { data: insertedSpaces, error } = await supabase
      .from('spaces')
      .insert(sampleSpaces)
      .select('id');

    if (error) {
      console.error('Error creating seed spaces:', error);
      return;
    }

    console.log('Seed data created successfully:', insertedSpaces);
    
  } catch (error) {
    console.error('Error in createSeedData:', error);
  }
};

export const initializeSeedData = () => {
  // Check if we're in the browser and user is authenticated
  if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Small delay to ensure user profile is created
        setTimeout(() => {
          createSeedData();
        }, 1000);
      }
    });
  }
};