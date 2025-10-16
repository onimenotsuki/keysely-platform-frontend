# Guía de Uso: Hero Banner con Contentful

## 📋 Resumen

Has integrado exitosamente el componente `HeroBannerContentful` que obtiene contenido dinámico desde Contentful CMS. Este componente muestra un hero banner con imágenes de fondo y texto CTA gestionados desde Contentful.

---

## ✅ Archivos Actualizados/Creados

### 1. **Tipos de Contentful** (`src/integrations/contentful/types.ts`)

```typescript
export interface HeroBannerSkeleton extends EntrySkeletonType {
  contentTypeId: 'heroBanner';
  fields: {
    cta: string;
    images?: Asset[];
  };
}

export type HeroBanner = Entry<HeroBannerSkeleton>;
export type HeroBannerCollection = EntryCollection<HeroBannerSkeleton>;
```

**✨ Cambios Clave:**

- `images?: Asset[]` - Tipo correcto para campos de tipo "Media, many files" en Contentful
- `Asset` es el tipo oficial de Contentful SDK para archivos multimedia

---

### 2. **Servicio de Contentful** (`src/integrations/contentful/services.ts`)

```typescript
export const getHeroBanner = async (): Promise<HeroBanner | null> => {
  try {
    const response = await contentfulClient.getEntries<HeroBannerSkeleton>({
      content_type: 'heroBanner',
      limit: 1,
      order: ['-sys.createdAt'],
    });
    return response.items[0] || null;
  } catch (error) {
    console.error('Error fetching hero banner:', error);
    return null;
  }
};
```

**✨ Cambios Clave:**

- Usa `getEntries()` con filtro `content_type` (correcto según docs de Contentful)
- `getEntry()` requiere un ID de entry, NO un nombre de content type
- Retorna `null` en caso de error para manejar gracefully

---

### 3. **Hook de React Query** (`src/hooks/useContentful.ts`)

```typescript
export const useHeroBanner = () => {
  return useQuery({
    queryKey: ['contentful', 'heroBanner'],
    queryFn: getHeroBanner,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2, // Reintentar 2 veces en caso de fallo
  });
};
```

**✨ Características:**

- Cache de 10 minutos para optimizar rendimiento
- Reintentos automáticos (2x) en caso de fallos de red
- Integración perfecta con TanStack Query

---

### 4. **Componente React** (`src/components/HeroBannerContentful.tsx`)

Componente completo con:

- ✅ Loading state (skeleton)
- ✅ Error handling
- ✅ Estado vacío (no content)
- ✅ Renderizado de imágenes de fondo
- ✅ CTA dinámico desde Contentful
- ✅ Galería de imágenes adicionales
- ✅ Barra de búsqueda integrada
- ✅ Info de debug (para desarrollo)

---

## 🎯 Cómo Usar el Componente

### Paso 1: Crear Content Type en Contentful

1. **Ve a tu Contentful Space** → Content model → Add content type
2. **Nombre:** `Hero Banner`
3. **API Identifier:** `heroBanner` (debe ser exactamente este)

4. **Agrega los siguientes campos:**

   **Campo 1: CTA Text**
   - **Field ID:** `cta`
   - **Type:** Short text
   - **Required:** Yes
   - **Help text:** "El texto principal del Hero Banner (ej: 'Find Your Perfect Workspace')"

   **Campo 2: Images**
   - **Field ID:** `images`
   - **Type:** Media (Many files)
   - **Validation:** Accept only images
   - **Required:** No
   - **Help text:** "Imágenes del Hero Banner. La primera será el fondo principal."

5. **Guarda el content type**

---

### Paso 2: Crear una Entry de Hero Banner

1. **Content → Add entry → Hero Banner**
2. **CTA:** Escribe tu texto principal, ejemplo:

   ```
   Find Your Perfect Workspace
   ```

   o en español:

   ```
   Encuentra tu Espacio de Trabajo Perfecto
   ```

3. **Images:** Sube 1-3 imágenes de alta calidad
   - **Primera imagen:** Se usará como fondo del hero (recomendado: 1920x1080px)
   - **Imágenes adicionales:** Se mostrarán en la galería inferior

4. **Publish** la entry

---

### Paso 3: Usar el Componente en tu App

**Opción A: Reemplazar Hero actual**

En `src/pages/Index.tsx`:

```typescript
import HeroBannerContentful from '../components/HeroBannerContentful';

const Index = () => {
  return (
    <>
      <HeroBannerContentful />  {/* Reemplaza <Hero /> */}
      <FeaturedSpaces />
      <Categories />
      {/* ... resto de componentes */}
    </>
  );
};
```

**Opción B: Usar condicionalmente**

```typescript
import { useHeroBanner } from '../hooks/useContentful';
import HeroBannerContentful from '../components/HeroBannerContentful';
import Hero from '../components/Hero';

const Index = () => {
  const { data: heroBanner } = useHeroBanner();

  return (
    <>
      {heroBanner ? <HeroBannerContentful /> : <Hero />}
      <FeaturedSpaces />
      {/* ... */}
    </>
  );
};
```

---

## 🔧 Configuración de Variables de Entorno

Asegúrate de tener estas variables en tu `.env`:

```bash
VITE_CONTENTFUL_SPACE_ID=tu_space_id_aqui
VITE_CONTENTFUL_ACCESS_TOKEN=tu_access_token_aqui

# Opcional: Para preview mode
VITE_CONTENTFUL_PREVIEW_TOKEN=tu_preview_token_aqui
VITE_CONTENTFUL_ENVIRONMENT=master
```

**Dónde encontrar estos valores:**

1. **Contentful Dashboard** → Settings → API keys
2. Crea una nueva API key si no tienes una
3. Copia:
   - **Space ID**
   - **Content Delivery API - access token**
   - **Content Preview API - access token** (opcional)

---

## 📊 Estructura de Datos de Contentful

Cuando haces fetch del Hero Banner, obtienes este objeto:

```typescript
{
  sys: {
    id: "abc123",
    type: "Entry",
    contentType: { sys: { id: "heroBanner" } },
    createdAt: "2024-01-15T10:00:00Z",
    // ... más metadata
  },
  fields: {
    cta: "Find Your Perfect Workspace",
    images: [
      {
        sys: { id: "img1", type: "Asset" },
        fields: {
          title: "Hero Background",
          file: {
            url: "//images.ctfassets.net/.../hero-bg.jpg",
            contentType: "image/jpeg",
            details: { size: 245678, image: { width: 1920, height: 1080 } }
          }
        }
      },
      // ... más imágenes
    ]
  }
}
```

---

## 🎨 Personalización del Componente

### Cambiar el diseño de búsqueda

En `HeroBannerContentful.tsx`, línea ~97:

```typescript
{/* Search Card - Keep your existing search functionality */}
<div className="bg-white rounded-2xl shadow-2xl p-8">
  {/* Personaliza los inputs aquí */}
</div>
```

### Agregar más campos desde Contentful

1. **Agrega el campo en Contentful:**

   ```
   Campo: subtitle
   Type: Short text
   ```

2. **Actualiza el tipo en TypeScript:**

   ```typescript
   // src/integrations/contentful/types.ts
   export interface HeroBannerSkeleton extends EntrySkeletonType {
     contentTypeId: 'heroBanner';
     fields: {
       cta: string;
       subtitle?: string; // ← Nuevo campo
       images?: Asset[];
     };
   }
   ```

3. **Úsalo en el componente:**

   ```typescript
   const subtitle: string = fields.subtitle || t('hero.subtitle');

   <p className="text-white/90 text-xl md:text-2xl mb-12">
     {subtitle}
   </p>
   ```

### Quitar el debug info

En producción, elimina este bloque (línea ~150):

```typescript
{/* Contentful Debug Info (remove in production) */}
<div className="mt-8 p-4 bg-blue-900/50 backdrop-blur-sm rounded-lg">
  {/* ... */}
</div>
```

---

## 🧪 Testing

### 1. **Verifica que el hook funcione:**

```typescript
// En cualquier componente
import { useHeroBanner } from '../hooks/useContentful';

const TestComponent = () => {
  const { data, isLoading, error } = useHeroBanner();

  console.log('Hero Banner:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  return <div>Check console</div>;
};
```

### 2. **Verifica las imágenes:**

Las URLs de Contentful deben verse así:

```
//images.ctfassets.net/YOUR_SPACE_ID/abc123/hero-image.jpg
```

Si ves URLs sin `https:`, el componente ya las maneja agregando el prefijo.

---

## 🐛 Troubleshooting

### Error: "No hero banner configured"

- ✅ Verifica que hayas publicado la entry en Contentful
- ✅ Revisa que el Content Type se llame exactamente `heroBanner`
- ✅ Confirma que las variables de entorno estén correctas

### Error: "Error loading hero banner from Contentful"

- ✅ Verifica tu Space ID y Access Token en `.env`
- ✅ Asegúrate de reiniciar el dev server después de cambiar `.env`
- ✅ Revisa la consola del navegador para más detalles

### Las imágenes no se muestran

- ✅ Verifica que las imágenes estén publicadas en Contentful
- ✅ Revisa que el campo se llame `images` (plural)
- ✅ Inspecciona la respuesta en Network tab del navegador

### TypeScript errors

- ✅ Asegúrate de tener `contentful` instalado: `bun add contentful`
- ✅ Reinicia el TypeScript server en VS Code: `Cmd+Shift+P` → "Restart TS Server"

---

## 📚 Recursos Adicionales

- [Contentful Content Delivery API Docs](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Contentful Asset Type Reference](https://contentful.github.io/contentful.js/interfaces/Asset.html)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)

---

## 🚀 Próximos Pasos Recomendados

1. ✅ **Crea tu Hero Banner en Contentful** con texto e imágenes
2. ✅ **Prueba el componente** en tu app local
3. ⏳ **Agrega más campos** (subtitle, button text, etc.)
4. ⏳ **Implementa i18n** para múltiples idiomas en Contentful
5. ⏳ **Integra funcionalidad de búsqueda** real
6. ⏳ **Optimiza imágenes** con Contentful Image API

---

¡Todo listo! 🎉 Tu Hero Banner ahora está conectado a Contentful CMS y puedes editarlo sin tocar código.
