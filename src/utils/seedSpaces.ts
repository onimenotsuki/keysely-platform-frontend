import { supabase } from '@/integrations/supabase/client';

// Predefined amenities list
export const AMENITIES_LIST = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Kitchen',
  'Projector',
  'Whiteboard',
  'Video Equipment',
  'Sound System',
  '24/7 Access',
  'Catering',
  'Cleaning Service',
  'Reception',
  'Natural Light',
  'Outdoor Space',
  'Disabled Access',
];

// Helper function to get random items from array
const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random number in range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mexican cities with coordinates - popular business districts
const cities = [
  { name: 'Ciudad de México', lat: 19.4326, lng: -99.1332, count: 25 },
  { name: 'Guadalajara', lat: 20.6597, lng: -103.3496, count: 30 },
  { name: 'Monterrey', lat: 25.6866, lng: -100.3161, count: 15 },
  { name: 'Puebla', lat: 19.0414, lng: -98.2063, count: 10 },
  { name: 'Querétaro', lat: 20.5888, lng: -100.3899, count: 8 },
  { name: 'Mérida', lat: 20.9674, lng: -89.5926, count: 7 },
  { name: 'Tijuana', lat: 32.5149, lng: -117.0382, count: 5 },
];

// Space name templates by category
const spaceTemplates = {
  'Oficina Privada': [
    'Oficina Ejecutiva {location}',
    'Suite Privada {location}',
    'Espacio Profesional {location}',
    'Oficina Premium {location}',
  ],
  Coworking: [
    'CoWork {location}',
    'Espacio Colaborativo {location}',
    'Hub de Trabajo {location}',
    'Community Space {location}',
  ],
  'Sala de Reuniones': [
    'Sala de Juntas {location}',
    'Sala de Conferencias {location}',
    'Meeting Room {location}',
    'Sala Ejecutiva {location}',
  ],
  'Sala de Conferencias': [
    'Auditorio {location}',
    'Centro de Eventos {location}',
    'Salón de Conferencias {location}',
    'Espacio para Eventos {location}',
  ],
  'Estudio Creativo': [
    'Estudio de Diseño {location}',
    'Espacio Creativo {location}',
    'Taller Artístico {location}',
    'Studio {location}',
  ],
};

const descriptions = [
  'Espacio moderno y luminoso con todas las comodidades necesarias para tu equipo. Perfecto para sesiones de trabajo productivas.',
  'Ubicación privilegiada en el corazón de la ciudad con acceso a transporte público. A minutos de las principales avenidas.',
  'Ambiente profesional diseñado para maximizar tu productividad. Cuenta con zonas de descanso y espacios colaborativos.',
  'Espacio flexible que se adapta a las necesidades de tu negocio. Ideal para equipos dinámicos y empresas en crecimiento.',
  'Diseño contemporáneo con mobiliario de alta calidad y tecnología de punta. Conexión de fibra óptica de alta velocidad.',
  'Ideal para equipos pequeños y medianos que buscan un espacio inspirador. Atmósfera profesional con acabados de lujo.',
  'Espacio equipado con las mejores instalaciones para garantizar tu comodidad. Servicios incluidos y personal de apoyo.',
  'Diseño minimalista y funcional. Perfecto para reuniones importantes y presentaciones profesionales.',
];

const features = [
  'Internet de alta velocidad',
  'Mobiliario ergonómico',
  'Sala de descanso',
  'Cocina equipada',
  'Áreas comunes',
  'Seguridad 24/7',
  'Servicio de limpieza',
  'Recepcionista',
  'Vista panorámica',
  'Luz natural',
  'Sistema de audio',
  'Pantalla de presentación',
  'Pizarra interactiva',
  'Área de cafetería',
  'Lockers personales',
  'Impresora y escáner',
];

const addresses = [
  'Av. Reforma',
  'Calle Juárez',
  'Paseo de la República',
  'Av. Insurgentes',
  'Calle Madero',
  'Av. Constitución',
  'Blvd. Miguel de Cervantes Saavedra',
  'Av. Chapultepec',
  'Calle Hamburgo',
  'Av. Universidad',
  'Paseo de las Palmas',
  'Av. Santa Fe',
];

export const generateSeedSpaces = async (hostIds: string[]) => {
  try {
    if (!hostIds || hostIds.length === 0) {
      throw new Error('No host IDs provided. Please provide at least one host ID.');
    }

    console.log(`📊 Distributing spaces among ${hostIds.length} hosts`);

    // Validate host IDs are UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalidIds = hostIds.filter((id) => !uuidRegex.test(id));
    
    if (invalidIds.length > 0) {
      console.error('❌ Invalid UUIDs detected in hostIds:', invalidIds);
      throw new Error(`Invalid UUIDs provided: ${invalidIds.join(', ')}`);
    }

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoriesError) throw categoriesError;
    if (!categories || categories.length === 0) {
      throw new Error('No categories found. Please seed categories first.');
    }

    const spaces = [];
    let spaceIndex = 0; // Track space index for round-robin distribution

    // Generate spaces for each city
    for (const city of cities) {
      for (let i = 0; i < city.count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const templates =
          spaceTemplates[category.name as keyof typeof spaceTemplates] ||
          spaceTemplates['Oficina Privada'];
        const template = templates[Math.floor(Math.random() * templates.length)];

        // Add variations to distribute spaces across popular business districts
        // Larger cities get wider distribution to cover multiple popular zones
        let variationRange = 0.03; // Default ~3km variation
        if (city.name === 'Ciudad de México') {
          variationRange = 0.08; // ~8km to cover Polanco, Santa Fe, Reforma, Condesa, Roma
        } else if (city.name === 'Guadalajara') {
          variationRange = 0.06; // ~6km to cover Providencia, Chapalita, Zapopan
        } else if (city.name === 'Monterrey') {
          variationRange = 0.05; // ~5km to cover San Pedro, Valle, Centro
        }

        const latVariation = (Math.random() - 0.5) * variationRange;
        const lngVariation = (Math.random() - 0.5) * variationRange;

        // Generate availability hours
        const startHour = randomInRange(7, 9);
        const endHour = randomInRange(18, 22);
        const availabilityHours = {
          monday: {
            start: `${startHour.toString().padStart(2, '0')}:00`,
            end: `${endHour.toString().padStart(2, '0')}:00`,
          },
          tuesday: {
            start: `${startHour.toString().padStart(2, '0')}:00`,
            end: `${endHour.toString().padStart(2, '0')}:00`,
          },
          wednesday: {
            start: `${startHour.toString().padStart(2, '0')}:00`,
            end: `${endHour.toString().padStart(2, '0')}:00`,
          },
          thursday: {
            start: `${startHour.toString().padStart(2, '0')}:00`,
            end: `${endHour.toString().padStart(2, '0')}:00`,
          },
          friday: {
            start: `${startHour.toString().padStart(2, '0')}:00`,
            end: `${endHour.toString().padStart(2, '0')}:00`,
          },
          ...(Math.random() > 0.5 && {
            saturday: {
              start: `${(startHour + 1).toString().padStart(2, '0')}:00`,
              end: `${(endHour - 2).toString().padStart(2, '0')}:00`,
            },
          }),
        };

        // Distribute spaces using round-robin among hosts
        const ownerId = hostIds[spaceIndex % hostIds.length];
        spaceIndex++;

        const space = {
          owner_id: ownerId,
          title: template.replace('{location}', city.name),
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          category_id: category.id,
          address: `${addresses[Math.floor(Math.random() * addresses.length)]} ${randomInRange(100, 999)}, ${city.name}`,
          city: city.name,
          price_per_hour: randomInRange(15, 200),
          currency: 'MXN',
          capacity: randomInRange(2, 50),
          area_sqm: randomInRange(20, 300),
          latitude: city.lat + latVariation,
          longitude: city.lng + lngVariation,
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
          ],
          features: getRandomItems(features, randomInRange(4, 8)),
          amenities: getRandomItems(AMENITIES_LIST, randomInRange(5, 12)),
          availability_hours: availabilityHours,
          is_active: true,
          rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
          total_reviews: randomInRange(0, 50),
          policies:
            'No se permiten mascotas. No fumar. Cancelación gratuita 24 horas antes. Depósito reembolsable requerido.',
        };

        spaces.push(space);
      }
    }

    // Insert all spaces
    const { data, error } = await supabase.from('spaces').insert(spaces).select();

    if (error) throw error;

    // Calculate distribution
    const spacesPerHost = Math.floor(spaces.length / hostIds.length);
    const remainder = spaces.length % hostIds.length;

    console.log(`✨ Successfully seeded ${data?.length || 0} spaces`);
    console.log(
      `📊 Distribution: ~${spacesPerHost} spaces per host (+${remainder} extra for first hosts)`
    );
    return data;
  } catch (error) {
    console.error('Error seeding spaces:', error);
    throw error;
  }
};

// Helper function to clear all spaces (useful for re-seeding)
export const clearAllSpaces = async () => {
  try {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) throw error;
    console.log('Successfully cleared all spaces');
  } catch (error) {
    console.error('Error clearing spaces:', error);
    throw error;
  }
};
