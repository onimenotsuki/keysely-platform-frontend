# Integración con Contentful CMS

Este directorio contiene la integración con Contentful CMS para la plataforma Keysely.

## 📋 Visión General

Contentful es un headless CMS que permite gestionar y entregar contenido mediante APIs. Esta integración usa la Content Delivery API (CDA) para obtener contenido publicado.

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
bun add contentful
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Agrega tus credenciales a `.env`:

```env
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token
VITE_CONTENTFUL_ENVIRONMENT=master
```

### 3. Obtener credenciales en Contentful

1. `https://app.contentful.com/`
2. Selecciona tu Space
3. Settings → API keys
4. Copia:
   - Space ID
   - Content Delivery API — access token
   - Content Preview API — access token (opcional)

## 📁 Estructura de Archivos

```
src/integrations/contentful/
├── client.ts          # Configuración del cliente de Contentful
├── types.ts           # Tipos TypeScript de modelos de contenido
├── services.ts        # Funciones de servicio (API)
└── README.md          # Este archivo (versión en inglés)

src/hooks/
└── useContentful.ts   # Hooks de React Query

src/components/
└── ContentfulExample.tsx  # Ejemplo de uso
```

## 🎯 Content Types de ejemplo

1. `blogPost`: título, slug, contenido, extracto, imagen destacada, autor, categoría, tags, SEO
2. `spaceHighlight`: título, descripción, imágenes, featured, displayOrder, referencia de espacio (JSON)
3. `marketingBanner`: título, subtítulo, CTA, imagen de fondo, estado activo y rango de fechas
4. `faq`: pregunta, respuesta, categoría, orden
5. `author`: nombre, bio, avatar, redes sociales
6. `category`: nombre, slug, descripción

## 🔧 Uso

### Con hooks (React Query)

```typescript
import { useFeaturedSpaceHighlights } from '@/hooks/useContentful';

function MyComponent() {
  const { data, isLoading, error } = useFeaturedSpaceHighlights();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading content</div>;
  return (
    <div>
      {data?.items.map((item) => (
        <div key={item.sys.id}>
          <h2>{item.fields.title}</h2>
          <p>{item.fields.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Usando servicios directamente

```typescript
import { getBlogPostBySlug } from '@/integrations/contentful/services';

const post = await getBlogPostBySlug('my-blog-post');
console.log(post?.fields.title);
```

## 🎨 Crear contenido en Contentful

### Paso 1: Modelo de contenido

Content model → Add content type → Campos que coincidan con `types.ts`.

Ejemplo `spaceHighlight`:

```
Content Type ID: spaceHighlight
Fields:
- title (Short text, required)
- description (Long text, required)
- images (Media, multiple files)
- featured (Boolean)
- displayOrder (Integer)
- space (JSON object con spaceId y spaceName)
```

### Paso 2: Crear contenido

Content → Add entry → Selecciona tu tipo → Completa campos → Publish

## 📚 Referencia de API

Hooks disponibles: `useBlogPosts`, `useBlogPost(slug)`, `useSpaceHighlights`, `useFeaturedSpaceHighlights`, `useActiveMarketingBanners`, `useFAQs`, `useFAQsByCategory(category)`

Servicios: `getAllBlogPosts`, `getBlogPostBySlug`, `getSpaceHighlights`, `getFeaturedSpaceHighlights`, `getSpaceHighlightById`, `getActiveMarketingBanners`, `getAllFAQs`, `getFAQsByCategory`

## 🔐 Autenticación

Usa la **Content Delivery API (CDA)** con Space ID y Access Token. Para contenido draft, usa la **Content Preview API** con el Preview Token.

## 📖 Recursos

- `https://www.contentful.com/developers/docs/`
- `https://www.contentful.com/developers/docs/references/content-delivery-api/`
- `https://github.com/contentful/contentful.js`
- `https://tanstack.com/query/latest`

## 🚨 Troubleshooting

"Cannot find VITE_CONTENTFUL_SPACE_ID": crea `.env` desde `.env.example` y completa tus credenciales.

"403 Forbidden" o "401 Unauthorized": revisa el Access Token y permisos.

Contenido no aparece: publica en Contentful, verifica `content_type` y el environment (`master`).

## 🎯 Próximos pasos

1. Crea modelos en Contentful
2. Actualiza `types.ts` según tus modelos
3. Implementa servicios en `services.ts`
4. Crea hooks en `useContentful.ts`
5. Úsalos en tus componentes
