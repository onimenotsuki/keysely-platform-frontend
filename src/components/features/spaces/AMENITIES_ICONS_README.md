# 🎨 Sistema de Íconos de Amenidades

Este documento explica cómo usar el sistema de íconos para amenidades en la plataforma Keysely.

## 📋 Descripción General

El sistema de íconos de amenidades proporciona una forma visual y consistente de mostrar las características de los espacios de trabajo. Utiliza íconos de `lucide-react` con soporte completo para tooltips, internacionalización y diferentes variantes de visualización.

## 🏗️ Arquitectura

### Archivos Principales

1. **`/src/config/amenitiesConfig.ts`** - Configuración central de amenidades
2. **`/src/components/features/spaces/AmenityBadge.tsx`** - Componente reutilizable
3. **Traducciones** - `/src/locales/es.json` y `/src/locales/en.json`

## 🎯 Componente AmenityBadge

### Props

```typescript
interface AmenityBadgeProps {
  amenity: string; // Nombre de la amenidad (por key o value)
  variant?: 'icon-only' | 'with-text' | 'icon-text';
  className?: string; // Clases CSS personalizadas
  iconSize?: number; // Tamaño del ícono (default: 20)
}
```

### Variantes

#### 1. `icon-only` (Recomendado para grids)

Solo muestra el ícono con tooltip al pasar el cursor.

```tsx
<AmenityBadge amenity="High-speed WiFi" variant="icon-only" />
```

**Uso:** SpaceDetail.tsx - Sección de amenidades

#### 2. `with-text` (Horizontal)

Muestra ícono + texto en línea horizontal.

```tsx
<AmenityBadge amenity="High-speed WiFi" variant="with-text" />
```

**Uso:** Listas compactas, cards pequeños

#### 3. `icon-text` (Vertical)

Muestra ícono arriba y texto abajo.

```tsx
<AmenityBadge amenity="High-speed WiFi" variant="icon-text" />
```

**Uso:** Layouts de grid grandes

## 📦 Amenidades Disponibles

| Amenidad               | Key                  | Ícono      |
| ---------------------- | -------------------- | ---------- |
| WiFi de alta velocidad | `highSpeedWifi`      | Wifi       |
| Impresora/Escáner      | `printerScanner`     | Printer    |
| Café y Té              | `coffeeAndTea`       | Coffee     |
| Acceso a Cocina        | `kitchenAccess`      | ChefHat    |
| Aire Acondicionado     | `airConditioning`    | AirVent    |
| Luz Natural            | `naturalLight`       | Sun        |
| Mobiliario Ergonómico  | `ergonomicFurniture` | Armchair   |
| Pizarra                | `whiteboard`         | Sparkles   |
| Proyector/Pantalla     | `projectorScreen`    | Projector  |
| Videoconferencias      | `videoConferencing`  | Video      |
| Sistema de Seguridad   | `securitySystem`     | Shield     |
| Acceso 24/7            | `access24x7`         | Clock      |
| Servicios de Recepción | `receptionServices`  | User       |
| Servicio de Limpieza   | `cleaningService`    | Sparkles   |
| Estacionamiento        | `parking`            | Car        |
| Transporte Público     | `publicTransport`    | Bus        |
| Almacén de Bicicletas  | `bikeStorage`        | Bike       |
| Instalaciones de Ducha | `showerFacilities`   | ShowerHead |
| Cabina Telefónica      | `phoneBooth`         | Phone      |
| Casilleros             | `lockers`            | Lock       |

## 💡 Ejemplos de Uso

### En SpaceDetail (Grid de íconos)

```tsx
<div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
  {space.amenities.map((amenity) => (
    <AmenityBadge key={amenity} amenity={amenity} variant="icon-only" />
  ))}
</div>
```

### En SpaceCard (Preview con contador)

```tsx
import { SpaceAmenities } from './SpaceAmenities';

<SpaceAmenities
  amenities={space.amenities || []}
  maxDisplay={4} // Muestra primeros 4 íconos
/>;
```

El componente `SpaceAmenities` muestra automáticamente:

- Los primeros N íconos (configurable con `maxDisplay`)
- Un badge "+X" con el conteo de amenidades restantes
- Tooltips en cada ícono

### En ListSpace (Formulario con checkboxes)

```tsx
{
  amenitiesConfig.map((amenity) => {
    const Icon = amenity.icon;
    return (
      <div key={amenity.key} className="flex items-center space-x-3">
        <Checkbox id={amenity.key} />
        <Icon className="h-5 w-5 text-primary" />
        <Label htmlFor={amenity.key}>{t(`listSpace.amenitiesList.${amenity.key}`)}</Label>
      </div>
    );
  });
}
```

### En Filtros de Búsqueda

```tsx
{
  amenitiesConfig.map((amenity) => {
    const Icon = amenity.icon;
    return (
      <div className="flex items-center space-x-3 hover:bg-secondary/50">
        <Checkbox id={`filter-${amenity.key}`} />
        <Icon className="h-4 w-4 text-primary" />
        <label>{t(`listSpace.amenitiesList.${amenity.key}`)}</label>
      </div>
    );
  });
}
```

## 🎯 Componentes y Ubicaciones

### Componentes Creados

1. **`AmenityBadge`** - Componente base para mostrar una amenidad con ícono
2. **`SpaceAmenities`** - Componente para SpaceCard que muestra preview de amenidades

### Ubicaciones Actualizadas

1. **SpaceDetail** → Grid de íconos con tooltips (8 columnas responsive)
2. **SpaceCard** → Preview de amenidades con primeros 3-4 íconos + contador
3. **ListSpace** → Formulario con íconos + checkboxes
4. **SearchFilters** → Filtros con íconos en el sidebar

## 🌐 Internacionalización

Las traducciones se gestionan automáticamente usando el hook `useTranslation()`:

```typescript
const { t } = useTranslation();
const translatedName = t(`listSpace.amenitiesList.${amenityKey}`);
```

### Agregar Nuevas Traducciones

1. **Agregar a `amenitiesConfig.ts`:**

```typescript
{
  key: 'newAmenity',
  value: 'New Amenity',
  icon: IconComponent,
}
```

2. **Agregar a `locales/en.json`:**

```json
"listSpace": {
  "amenitiesList": {
    "newAmenity": "New Amenity"
  }
}
```

3. **Agregar a `locales/es.json`:**

```json
"listSpace": {
  "amenitiesList": {
    "newAmenity": "Nueva Amenidad"
  }
}
```

## 🎨 Personalización de Estilos

### Cambiar Colores

Los íconos usan la clase `text-primary` por defecto. Puedes personalizar:

```tsx
<AmenityBadge amenity="WiFi" className="[&_svg]:text-blue-500" />
```

### Cambiar Tamaño de Ícono

```tsx
<AmenityBadge amenity="WiFi" iconSize={24} />
```

### Hover Effects

Los badges incluyen efectos hover automáticos:

- `icon-only`: Scale 1.1 en hover
- `with-text`: Opacity reducida
- Tooltips con animación fade-in

## ♿ Accesibilidad

- ✅ Soporte para `aria-label`
- ✅ Navegación por teclado (`tabIndex={0}`)
- ✅ Tooltips descriptivos
- ✅ Alto contraste en modo oscuro

## 🌙 Modo Oscuro

El sistema usa variables CSS de Tailwind que se adaptan automáticamente:

- `text-primary` → Ajustado para ambos modos
- `bg-secondary` → Background adaptativo
- `text-secondary-foreground` → Texto legible en ambos modos

## 🔧 Utilidades

### Funciones Auxiliares

```typescript
import { getAmenityByValue, getAmenityByKey } from '@/config/amenitiesConfig';

// Buscar por value
const amenity = getAmenityByValue('High-speed WiFi');

// Buscar por key
const amenity = getAmenityByKey('highSpeedWifi');
```

## 📱 Responsive Design

### Breakpoints Recomendados

```tsx
// Grid adaptativo
<div className="grid
  grid-cols-4      // Mobile
  sm:grid-cols-5   // Small tablets
  md:grid-cols-6   // Tablets
  lg:grid-cols-8   // Desktop
  gap-3"
>
```

## 🐛 Troubleshooting

### El ícono no aparece

**Problema:** La amenidad no tiene ícono asignado.

**Solución:** Verifica que la amenidad esté en `amenitiesConfig.ts` con un ícono válido.

### Las traducciones no funcionan

**Problema:** La key de traducción no existe.

**Solución:** Verifica que la key exista en ambos archivos de locales (`en.json` y `es.json`).

### Los tooltips no aparecen

**Problema:** Falta el `TooltipProvider`.

**Solución:** El componente `AmenityBadge` ya incluye el provider, no es necesario agregarlo externamente.

## 🚀 Performance

- **Lazy Loading:** Los íconos se cargan bajo demanda
- **Tree Shaking:** Solo los íconos usados se incluyen en el bundle
- **Memoización:** El componente puede ser memoizado si es necesario

```tsx
import { memo } from 'react';
const MemoizedAmenityBadge = memo(AmenityBadge);
```

## 📝 Best Practices

1. ✅ Usa `icon-only` para grids densos
2. ✅ Usa `with-text` para listas verticales
3. ✅ Mantén consistencia en el tamaño de íconos
4. ✅ Siempre usa las traducciones (no hardcodear texto)
5. ✅ Prueba en modo claro y oscuro

## 🔄 Migración de Código Antiguo

### Antes (Badges simples)

```tsx
<Badge variant="secondary">{amenity}</Badge>
```

### Después (Con íconos)

```tsx
<AmenityBadge amenity={amenity} variant="icon-only" />
```

## 📞 Soporte

Para más información o reportar issues, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025  
**Mantenedor:** Equipo Keysely Platform
