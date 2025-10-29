# 🚀 Guía Rápida: Configurar Contentful CMS para Keysely

## Paso 1: Crear una cuenta en Contentful

1. Ve a `https://www.contentful.com/`
2. Haz clic en **Sign up** o **Get started free**
3. Crea tu cuenta (GitHub, Google o email)
4. Contentful ofrece un plan gratuito para empezar

## Paso 2: Crear tu Space

1. Una vez dentro, haz clic en **Create space**
2. Asigna un nombre (ej.: "Keysely Platform")
3. Selecciona **Empty space**
4. Clic en **Create space**

## Paso 3: Obtener tus credenciales de API

1. En tu Space, ve a **Settings (⚙️) → API keys**
2. Clic en **Add API key**
3. Ponle un nombre (ej.: "Keysely Frontend")
4. Copia y guarda:
   - Space ID → `VITE_CONTENTFUL_SPACE_ID`
   - Content Delivery API - access token → `VITE_CONTENTFUL_ACCESS_TOKEN`
   - Content Preview API - access token (opcional) → `VITE_CONTENTFUL_PREVIEW_TOKEN`

## Paso 4: Configurar variables de entorno

1. Copia el archivo de ejemplo y crea `.env`:

```bash
cp .env.example .env
```

2. Abre `.env` y agrega tus credenciales:

```env
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here
VITE_CONTENTFUL_ENVIRONMENT=master
```

## Paso 5: Crear tu primer Content Model

Ejemplo: `Space Highlight`

1. En Contentful, ve a **Content model**
2. Clic en **Add content type**
3. Configura:
   - Name: `Space Highlight`
   - API Identifier: `spaceHighlight`
4. Clic en **Create**
5. Añade campos (Add field):
   - Campo 1: Title
     - Type: Short text
     - Field ID: `title`
     - Required ✓
     - Unique ✓

   - Campo 2: Description
     - Type: Long text
     - Field ID: `description`
     - Required ✓

   - Campo 3: Images
     - Type: Media (many files)
     - Field ID: `images`

   - Campo 4: Featured
     - Type: Boolean
     - Field ID: `featured`
     - Default: `false`

   - Campo 5: Display Order
     - Type: Integer
     - Field ID: `displayOrder`
     - Default: `0`

   - Campo 6: Space (JSON Object)
     - Type: JSON object
     - Field ID: `space`

6. Clic en **Save**

## Paso 6: Crear tu primer contenido (Entry)

1. Ve a **Content**
2. Clic en **Add entry**
3. Selecciona `Space Highlight`
4. Llena los campos (ejemplo):
   - Title: "Modern Office in Querétaro"
   - Description: "Bright and modern space perfect for creative sessions"
   - Images: sube una o varias imágenes
   - Featured: ✓
   - Display Order: `1`
   - Space (JSON):

```json
{
  "spaceId": "123",
  "spaceName": "Creative Studio QRO"
}
```

5. Clic en **Publish** (no solo Save)

## Paso 7: Probar la integración

1. Reinicia tu servidor de desarrollo:

```bash
bun run dev
```

2. Añade el componente de ejemplo en tu página:

```typescript
// En src/pages/Index.tsx
import ContentfulExample from '../components/ContentfulExample';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ContentfulExample />
      <Categories />
      <FeaturedSpaces />
      <Footer />
    </div>
  );
};
```

3. Abre `http://localhost:8080`
4. Deberías ver tu contenido de Contentful renderizado

## ✅ Verificación

Si todo está bien configurado, deberías ver:

- El componente `ContentfulExample` sin errores
- El título y descripción de tu entrada
- Las imágenes que subiste
- Un mensaje azul al final: "Contentful Integration Active: Displaying X featured items"

## 🐛 Troubleshooting

### No veo mi contenido

1. Verifica que el contenido esté PUBLICADO
2. Revisa la consola del navegador por errores
3. Verifica variables de entorno
4. Reinicia el servidor tras modificar `.env`

### Error 401 o 403

- El access token es incorrecto. Copia nuevamente desde Settings → API keys

### Error "Cannot find VITE_CONTENTFUL_SPACE_ID"

- Falta crear `.env` desde `.env.example`, o reiniciar el servidor tras crearlo

## 🎯 Próximos Pasos

1. Crea más content types con el mismo proceso
2. Actualiza tipos en `src/integrations/contentful/types.ts`
3. Crea servicios en `src/integrations/contentful/services.ts`
4. Crea hooks en `src/hooks/useContentful.ts`
5. Usa el contenido en tus páginas y componentes

## 📚 Recursos útiles

- `https://www.contentful.com/developers/docs/`
- `https://www.contentful.com/developers/docs/references/content-delivery-api/`
- `https://www.contentful.com/help/content-modelling-basics/`

---

¡Listo! Contentful quedó integrado en tu plataforma Keysely. 🎉
