# Guía de Uso: Hero Banner con Contentful

## 📋 Resumen

El componente `HeroBannerContentful` obtiene contenido dinámico desde Contentful y muestra un hero con imagen de fondo y texto CTA administrado desde el CMS.

---

## ✅ Archivos Clave

1. `src/integrations/contentful/types.ts` — Tipos de Contentful

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

2. `src/integrations/contentful/services.ts` — Servicio para obtener el hero

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

3. `src/hooks/useContentful.ts` — Hook con React Query

```typescript
export const useHeroBanner = () => {
  return useQuery({
    queryKey: ['contentful', 'heroBanner'],
    queryFn: getHeroBanner,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};
```

4. `src/components/HeroBannerContentful.tsx` — Componente React

Incluye estados de carga/error, imagen de fondo, CTA dinámico, galería adicional e integración con la barra de búsqueda.

---

## 🎯 Cómo usar el componente

### Paso 1: Crear el Content Type en Contentful

1. Content model → Add content type
2. Name: `Hero Banner`
3. API Identifier: `heroBanner`
4. Campos:
   - `cta` (Short text, requerido)
   - `images` (Media, many files, opcional)

### Paso 2: Crear una entrada (Entry)

1. Content → Add entry → Hero Banner
2. CTA: texto principal, ej.: `Encuentra tu Espacio de Trabajo Perfecto`
3. Images: sube 1–3 imágenes (la primera será el fondo)
4. Publica la entrada

### Paso 3: Usarlo en tu app

Opción A — Reemplazar el Hero actual:

```typescript
import HeroBannerContentful from '../components/HeroBannerContentful';

const Index = () => (
  <>
    <HeroBannerContentful />
    <FeaturedSpaces />
    <Categories />
  </>
);
```

Opción B — Usarlo condicionalmente:

```typescript
import { useHeroBanner } from '../hooks/useContentful';
import HeroBannerContentful from '../components/HeroBannerContentful';
import Hero from '../components/Hero';

const Index = () => {
  const { data: heroBanner } = useHeroBanner();
  return <>{heroBanner ? <HeroBannerContentful /> : <Hero />}</>;
};
```

---

## 🔧 Variables de entorno

```bash
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
# Opcional (preview)
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here
VITE_CONTENTFUL_ENVIRONMENT=master
```

Valores en Contentful: Settings → API keys.

---

## 🧪 Pruebas rápidas

```typescript
import { useHeroBanner } from '../hooks/useContentful';

const TestComponent = () => {
  const { data, isLoading, error } = useHeroBanner();
  console.log({ data, isLoading, error });
  return <div>Check console</div>;
};
```

URLs de imágenes válidas:

```text
//images.ctfassets.net/YOUR_SPACE_ID/asset-id/hero-image.jpg
```

---

## 🐛 Troubleshooting

- "No hero banner configured": publica la entrada en Contentful; ID del content type exacto `heroBanner`; revisa `.env`.
- "Error loading hero banner from Contentful": verifica Space ID y Access Token; reinicia el dev server tras cambiar `.env`.
- Imágenes no visibles: confirma que estén publicadas y que el campo sea `images`.

---

## 📚 Recursos

- `https://www.contentful.com/developers/docs/references/content-delivery-api/`
- `https://contentful.github.io/contentful.js/interfaces/Asset.html`
- `https://tanstack.com/query/latest/docs/react/overview`

---

Todo listo 🎉 Puedes editar el Hero desde Contentful sin tocar código.
