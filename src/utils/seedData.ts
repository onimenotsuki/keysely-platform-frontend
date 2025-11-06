import { supabase } from '@/integrations/supabase/client';

export const createSeedData = async () => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const { data: categories } = await supabase.from('categories').select('id, name');

    if (!categories || categories.length === 0) {
      console.log('No categories found');
      return;
    }

    const officeCategory = categories.find((c) => c.name === 'Oficina Privada')?.id;
    const meetingCategory = categories.find((c) => c.name === 'Sala de Reuniones')?.id;
    const coworkingCategory = categories.find((c) => c.name === 'Coworking')?.id;

    // Create sample spaces for the current user
    const sampleSpaces = [
      {
        title: 'Oficina Privada Premium Polanco',
        description:
          'Elegante oficina privada perfecta para equipos pequeños. Ubicada en una zona comercial con excelente conectividad y rodeada de restaurantes de primer nivel.',
        address: 'Av. Masaryk 123, Polanco',
        city: 'Ciudad de México',
        latitude: 19.4326,
        longitude: -99.1932,
        price_per_hour: 350,
        capacity: 6,
        area_sqm: 40,
        images: [
          '/placeholder.svg?height=400&width=600&text=Oficina+Principal',
          '/placeholder.svg?height=400&width=600&text=Vista+Interior',
        ],
        features: [
          'Vista panorámica',
          'Luz natural',
          'Mobiliario moderno',
          'Sistema de audio',
          'Pantalla de presentación',
        ],
        amenities: [
          'WiFi',
          'Air Conditioning',
          'Kitchen',
          'Parking',
          'Cleaning Service',
          'Reception',
        ],
        availability_hours: {
          monday: { start: '08:00', end: '20:00' },
          tuesday: { start: '08:00', end: '20:00' },
          wednesday: { start: '08:00', end: '20:00' },
          thursday: { start: '08:00', end: '20:00' },
          friday: { start: '08:00', end: '20:00' },
        },
        policies:
          'No se permite fumar. Política de cancelación: 24 horas de anticipación. Depósito reembolsable requerido.',
        owner_id: user.id,
        category_id: officeCategory,
        is_active: true,
      },
      {
        title: 'Sala de Reuniones Ejecutiva Santa Fe',
        description:
          'Sala de reuniones equipada con tecnología de punta para presentaciones profesionales. Perfecta para juntas de negocios y conferencias virtuales.',
        address: 'Av. Santa Fe 456, Santa Fe',
        city: 'Ciudad de México',
        latitude: 19.3595,
        longitude: -99.2632,
        price_per_hour: 480,
        capacity: 10,
        area_sqm: 25,
        images: [
          '/placeholder.svg?height=400&width=600&text=Sala+Reuniones',
          '/placeholder.svg?height=400&width=600&text=Sala+Equipada',
        ],
        features: [
          'Mesa ejecutiva',
          'Pantalla 4K',
          'Sistema de audio profesional',
          'Pizarra interactiva',
          'Iluminación ajustable',
        ],
        amenities: [
          'WiFi',
          'Air Conditioning',
          'Projector',
          'Video Equipment',
          'Sound System',
          'Catering',
          'Parking',
        ],
        availability_hours: {
          monday: { start: '07:00', end: '22:00' },
          tuesday: { start: '07:00', end: '22:00' },
          wednesday: { start: '07:00', end: '22:00' },
          thursday: { start: '07:00', end: '22:00' },
          friday: { start: '07:00', end: '22:00' },
          saturday: { start: '08:00', end: '18:00' },
        },
        policies:
          'Reserva mínima de 2 horas. Incluye servicio básico de café. Cancelación gratuita 24 horas antes.',
        owner_id: user.id,
        category_id: meetingCategory,
        is_active: true,
      },
      {
        title: 'Espacio Coworking Reforma',
        description:
          'Espacio de coworking vibrante en el corazón de Reforma. Ideal para freelancers y startups. Ambiente colaborativo con eventos networking semanales.',
        address: 'Paseo de la Reforma 789, Cuauhtémoc',
        city: 'Ciudad de México',
        latitude: 19.4284,
        longitude: -99.1677,
        price_per_hour: 180,
        capacity: 20,
        area_sqm: 120,
        images: [
          '/placeholder.svg?height=400&width=600&text=Coworking+Space',
          '/placeholder.svg?height=400&width=600&text=Area+Colaborativa',
        ],
        features: [
          'Internet de alta velocidad',
          'Áreas comunes',
          'Cocina equipada',
          'Área de cafetería',
          'Lockers personales',
          'Sala de descanso',
        ],
        amenities: [
          'WiFi',
          'Air Conditioning',
          'Kitchen',
          'Parking',
          '24/7 Access',
          'Cleaning Service',
          'Reception',
          'Natural Light',
        ],
        availability_hours: {
          monday: { start: '07:00', end: '22:00' },
          tuesday: { start: '07:00', end: '22:00' },
          wednesday: { start: '07:00', end: '22:00' },
          thursday: { start: '07:00', end: '22:00' },
          friday: { start: '07:00', end: '22:00' },
          saturday: { start: '09:00', end: '18:00' },
          sunday: { start: '10:00', end: '16:00' },
        },
        policies:
          'Espacio pet-friendly. No fumar. Cancelación gratuita 24 horas antes. Membresías mensuales disponibles.',
        owner_id: user.id,
        category_id: coworkingCategory,
        is_active: true,
      },
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
  if (globalThis.window !== undefined) {
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
