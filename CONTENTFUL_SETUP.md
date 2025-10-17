# 🚀 Guía Rápida: Configurar Contentful CMS para Keysely

## Paso 1: Crear una Cuenta en Contentful

1. Ve a [https://www.contentful.com/](https://www.contentful.com/)
2. Haz clic en **Sign up** o **Get started free**
3. Crea tu cuenta (puedes usar GitHub, Google o email)
4. Contentful ofrece un plan gratuito para empezar

## Paso 2: Crear tu Espacio (Space)

1. Una vez logueado, haz clic en **Create space**
2. Elige un nombre para tu espacio, por ejemplo: "Keysely Platform"
3. Selecciona **Empty space** (espacio vacío)
4. Haz clic en **Create space**

## Paso 3: Obtener tus Credenciales API

1. En tu espacio, ve a **Settings** (⚙️) en la parte superior
2. Haz clic en **API keys**
3. Haz clic en **Add API key**
4. Dale un nombre, por ejemplo: "Keysely Frontend"
5. Copia y guarda estos valores:
   - **Space ID** (lo necesitarás para VITE_CONTENTFUL_SPACE_ID)
   - **Content Delivery API - access token** (para VITE_CONTENTFUL_ACCESS_TOKEN)
   - **Content Preview API - access token** (opcional, para VITE_CONTENTFUL_PREVIEW_TOKEN)

## Paso 4: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Abre `.env` y añade tus credenciales:
   ```env
   VITE_CONTENTFUL_SPACE_ID=tu_space_id_aqui
   VITE_CONTENTFUL_ACCESS_TOKEN=tu_access_token_aqui
   VITE_CONTENTFUL_PREVIEW_TOKEN=tu_preview_token_aqui
   VITE_CONTENTFUL_ENVIRONMENT=master
   ```

## Paso 5: Crear tu Primer Content Model

### Ejemplo: Space Highlight (Espacio Destacado)

1. En Contentful, ve a **Content model**
2. Haz clic en **Add content type**
3. Configura:
   - **Name**: Space Highlight
   - **API Identifier**: `spaceHighlight`
4. Haz clic en **Create**

5. Ahora añade campos (Add field):

   **Campo 1: Title**
   - Type: **Short text**
   - Name: `Title`
   - Field ID: `title`
   - ✓ Required
   - ✓ Unique

   **Campo 2: Description**
   - Type: **Long text**
   - Name: `Description`
   - Field ID: `description`
   - ✓ Required

   **Campo 3: Images**
   - Type: **Media**
   - Name: `Images`
   - Field ID: `images`
   - ✓ Many files

   **Campo 4: Featured**
   - Type: **Boolean**
   - Name: `Featured`
   - Field ID: `featured`
   - Default: `false`

   **Campo 5: Display Order**
   - Type: **Integer**
   - Name: `Display Order`
   - Field ID: `displayOrder`
   - Default: `0`

   **Campo 6: Space (JSON Object)**
   - Type: **JSON object**
   - Name: `Space`
   - Field ID: `space`

6. Haz clic en **Save** para guardar el content type

## Paso 6: Crear tu Primera Entrada de Contenido

1. Ve a **Content** en la navegación superior
2. Haz clic en **Add entry**
3. Selecciona **Space Highlight**
4. Llena los campos:
   - **Title**: "Oficina Moderna en Querétaro"
   - **Description**: "Espacio luminoso y moderno perfecto para sesiones creativas"
   - **Images**: Sube una o varias imágenes
   - **Featured**: Marca como ✓ (checked)
   - **Display Order**: 1
   - **Space** (JSON):
     ```json
     {
       "spaceId": "123",
       "spaceName": "Creative Studio QRO"
     }
     ```
5. Haz clic en **Publish** (no solo Save)

## Paso 7: Probar la Integración

1. Reinicia tu servidor de desarrollo:

   ```bash
   bun run dev
   ```

2. Añade el componente de ejemplo a tu página:

   ```typescript
   // En src/pages/Index.tsx
   import ContentfulExample from '../components/ContentfulExample';

   const Index = () => {
     return (
       <div className="min-h-screen">
         <Header />
         <Hero />
         <ContentfulExample /> {/* 👈 Añade este componente */}
         <Categories />
         <FeaturedSpaces />
         <Footer />
       </div>
     );
   };
   ```

3. Abre tu navegador en http://localhost:8080
4. Deberías ver tu contenido de Contentful renderizado!

## ✅ Verificación

Si todo está bien configurado, deberías ver:

- ✅ El componente `ContentfulExample` renderizando sin errores
- ✅ El título y descripción de tu entrada
- ✅ Las imágenes que subiste
- ✅ Un mensaje azul al final: "Contentful Integration Active: Displaying X featured items"

## 🐛 Troubleshooting

### No veo mi contenido

1. **Verifica que el contenido esté PUBLICADO** (Publish, no solo Save)
2. Revisa la consola del navegador para ver errores
3. Verifica que las variables de entorno estén correctas
4. Asegúrate de haber reiniciado el servidor después de cambiar `.env`

### Error 401 o 403

- Tu access token es incorrecto
- Ve a Settings > API keys en Contentful y copia nuevamente el token

### Error "Cannot find VITE_CONTENTFUL_SPACE_ID"

- No copiaste `.env.example` a `.env`
- O no reiniciaste el servidor después de crear `.env`

## 🎯 Próximos Pasos

1. **Crea más content types** siguiendo el mismo proceso
2. **Actualiza los tipos TypeScript** en `src/integrations/contentful/types.ts`
3. **Crea servicios** para tus nuevos content types en `services.ts`
4. **Crea hooks** en `useContentful.ts` para usar en tus componentes
5. **Usa el contenido** en tus páginas y componentes

## 📚 Recursos Útiles

- [Documentación de Contentful](https://www.contentful.com/developers/docs/)
- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Guía de Content Modeling](https://www.contentful.com/help/content-modelling-basics/)

## 💡 Tips

- **Usa el Content Preview API** para ver contenido draft antes de publicar
- **Organiza tu contenido** con categorías y tags
- **Aprovecha las referencias** entre content types (como Author → Blog Post)
- **Usa validaciones** en los campos para asegurar calidad de contenido
- **Implementa i18n** en Contentful para contenido multiidioma

¡Listo! Ahora tienes Contentful completamente integrado en tu plataforma Keysely. 🎉
