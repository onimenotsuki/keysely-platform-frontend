# Guía de Datos de Inicio (Seed Data)

Esta guía explica cómo usar el sistema de seeding para poblar tu base de datos con datos de prueba.

## 📁 Archivos de Seeding

### 1. `src/utils/seedData.ts`

Crea 3 espacios de muestra para el usuario actual:

- Oficina Privada Premium en Polanco
- Sala de Reuniones Ejecutiva en Santa Fe
- Espacio Coworking en Reforma

**Características:**

- Datos detallados y realistas
- Coordenadas GPS reales de Ciudad de México
- Horarios de disponibilidad configurados
- Amenidades y características completas
- Se ejecuta automáticamente al hacer login (con retraso de 1 segundo)

### 2. `src/utils/seedSpaces.ts`

Genera hasta 55 espacios distribuidos en 6 ciudades mexicanas:

- Ciudad de México (20 espacios)
- Monterrey (10 espacios)
- Guadalajara (10 espacios)
- Puebla (5 espacios)
- Querétaro (5 espacios)
- Mérida (5 espacios)

**Características:**

- Nombres de espacios dinámicos por categoría
- Coordenadas GPS reales con variación
- Precios aleatorios entre $15 y $200 por hora
- Capacidad aleatoria de 2 a 50 personas
- Áreas de 20 a 300 m²
- Amenidades y características aleatorias
- Ratings de 3.0 a 5.0
- Horarios de disponibilidad dinámicos

### 3. `src/utils/runSeed.ts` (Nuevo)

Utilidades helper para ejecutar el seeding fácilmente.

## 🚀 Cómo Usar

### Opción 1: Uso desde Código

```typescript
import { runFullSeed, runBasicSeed, runBulkSeed } from '@/utils/runSeed';

// Opción A: Seed completo (inicial + múltiples espacios)
await runFullSeed({
  clearExisting: false, // No borrar espacios existentes
  generateMultipleSpaces: true, // Generar espacios en múltiples ciudades
});

// Opción B: Solo espacios iniciales (3 espacios)
await runBasicSeed();

// Opción C: Solo espacios masivos (55 espacios)
await runBulkSeed();
```

### Opción 2: Uso desde Consola del Navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver utilidades disponibles
window.seedUtils;

// Seed completo
await window.seedUtils.runFullSeed();

// Seed básico (3 espacios)
await window.seedUtils.runBasicSeed();

// Seed masivo (55 espacios)
await window.seedUtils.runBulkSeed();

// Limpiar todos los espacios
await window.seedUtils.clearSpaces();

// Ver estadísticas
await window.seedUtils.getSpaceStats();

// Ver amenidades disponibles
window.seedUtils.showAvailableAmenities();
```

### Opción 3: Desde un Componente

```typescript
import { useEffect } from 'react';
import { runFullSeed } from '@/utils/runSeed';

function AdminPanel() {
  const handleSeed = async () => {
    const result = await runFullSeed({
      clearExisting: true,  // Limpiar datos existentes
      generateMultipleSpaces: true
    });

    if (result.success) {
      console.log('¡Seeding exitoso!');
    }
  };

  return (
    <button onClick={handleSeed}>
      Generar Datos de Prueba
    </button>
  );
}
```

## 📊 Datos Generados

### Campos de los Espacios

Cada espacio incluye:

```typescript
{
  title: string              // Nombre del espacio
  description: string        // Descripción detallada
  address: string           // Dirección completa
  city: string             // Ciudad
  latitude: number         // Coordenada GPS
  longitude: number        // Coordenada GPS
  price_per_hour: number   // Precio por hora ($15-$200)
  capacity: number         // Capacidad (2-50 personas)
  area_sqm: number        // Área en m² (20-300)
  category_id: uuid       // ID de categoría
  owner_id: uuid          // ID del propietario
  images: string[]        // URLs de imágenes
  features: string[]      // Características (4-8)
  amenities: string[]     // Amenidades (5-12)
  availability_hours: {   // Horarios de disponibilidad
    monday: { start, end }
    tuesday: { start, end }
    // ... etc
  }
  policies: string        // Políticas del espacio
  is_active: boolean     // Activo/Inactivo
  rating: number        // Rating (3.0-5.0)
  total_reviews: number // Número de reseñas (0-50)
}
```

### Amenidades Disponibles

```typescript
- WiFi
- Parking
- Air Conditioning
- Kitchen
- Projector
- Whiteboard
- Video Equipment
- Sound System
- 24/7 Access
- Catering
- Cleaning Service
- Reception
- Natural Light
- Outdoor Space
- Disabled Access
```

### Características Disponibles

```typescript
- Internet de alta velocidad
- Mobiliario ergonómico
- Sala de descanso
- Cocina equipada
- Áreas comunes
- Seguridad 24/7
- Servicio de limpieza
- Recepcionista
- Vista panorámica
- Luz natural
- Sistema de audio
- Pantalla de presentación
- Pizarra interactiva
- Área de cafetería
- Lockers personales
- Impresora y escáner
```

## 🗺️ Ciudades y Coordenadas

| Ciudad           | Lat     | Lng       | Espacios |
| ---------------- | ------- | --------- | -------- |
| Ciudad de México | 19.4326 | -99.1332  | 20       |
| Monterrey        | 25.6866 | -100.3161 | 10       |
| Guadalajara      | 20.6597 | -103.3496 | 10       |
| Puebla           | 19.0414 | -98.2063  | 5        |
| Querétaro        | 20.5888 | -100.3899 | 5        |
| Mérida           | 20.9674 | -89.5926  | 5        |

Cada espacio tiene una pequeña variación en las coordenadas (~5km) para distribuirlos en la ciudad.

## ⚠️ Notas Importantes

1. **Autenticación Requerida**: Debes estar autenticado antes de ejecutar el seeding.

2. **Seed Automático**: El archivo `seedData.ts` se ejecuta automáticamente al hacer login por primera vez.

3. **Duplicados**: El sistema verifica si el usuario ya tiene espacios antes de crear los iniciales.

4. **Categorías**: Asegúrate de que las categorías existan en la base de datos:
   - Oficina Privada
   - Sala de Reuniones
   - Coworking
   - Sala de Conferencias
   - Estudio Creativo

5. **Imágenes**: Los espacios usan imágenes placeholder. Actualiza las URLs para usar imágenes reales.

6. **Limpieza**: Usa `clearSpaces()` con precaución, ya que eliminará TODOS los espacios de la base de datos.

## 🔄 Actualizar Datos Existentes

Si necesitas actualizar las coordenadas o campos adicionales en espacios existentes:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Actualizar un espacio específico
await supabase
  .from('spaces')
  .update({
    latitude: 19.4326,
    longitude: -99.1332,
  })
  .eq('id', 'SPACE_ID');

// Actualizar espacios por ciudad
await supabase
  .from('spaces')
  .update({ latitude: 19.4326, longitude: -99.1332 })
  .eq('city', 'Ciudad de México');
```

## 🧪 Testing

Para probar el sistema de seeding:

1. Crea un usuario de prueba
2. Ejecuta `runFullSeed({ clearExisting: true })`
3. Verifica en Supabase que se crearon los espacios
4. Prueba el buscador y filtros con los datos generados
5. Verifica que las coordenadas GPS funcionen en el mapa

## 📝 Personalización

Para personalizar los datos generados, edita:

- **Nombres**: Modifica `spaceTemplates` en `seedSpaces.ts`
- **Descripciones**: Modifica `descriptions` en `seedSpaces.ts`
- **Características**: Modifica `features` en `seedSpaces.ts`
- **Amenidades**: Modifica `AMENITIES_LIST` en `seedSpaces.ts`
- **Ciudades**: Modifica `cities` en `seedSpaces.ts`
- **Rangos de precios**: Modifica `randomInRange(15, 200)` en `seedSpaces.ts`

## 🐛 Troubleshooting

### Error: "No categories found"

**Solución**: Crea las categorías primero en Supabase.

### Error: "User not authenticated"

**Solución**: Inicia sesión antes de ejecutar el seeding.

### Error: "Permission denied"

**Solución**: Verifica las políticas RLS en Supabase.

### Los espacios no aparecen en el mapa

**Solución**: Verifica que los campos `latitude` y `longitude` existan en tu tabla y tengan valores válidos.

## 🎯 Siguientes Pasos

Después de generar los datos:

1. ✅ Prueba el sistema de búsqueda en `/explore`
2. ✅ Verifica los filtros por ciudad, precio y capacidad
3. ✅ Prueba el mapa interactivo con las coordenadas GPS
4. ✅ Revisa que Algolia indexe correctamente los espacios
5. ✅ Genera reservas de prueba si es necesario
