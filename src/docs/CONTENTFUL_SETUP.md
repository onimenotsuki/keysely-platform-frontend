# 🚀 Quick Guide: Setting Up Contentful CMS for Keysely# 🚀 Guía Rápida: Configurar Contentful CMS para Keysely

## Step 1: Create a Contentful Account## Paso 1: Crear una Cuenta en Contentful

1. Go to [https://www.contentful.com/](https://www.contentful.com/)1. Ve a [https://www.contentful.com/](https://www.contentful.com/)

2. Click on **Sign up** or **Get started free**2. Haz clic en **Sign up** o **Get started free**

3. Create your account (you can use GitHub, Google, or email)3. Crea tu cuenta (puedes usar GitHub, Google o email)

4. Contentful offers a free plan to get started4. Contentful ofrece un plan gratuito para empezar

## Step 2: Create Your Space## Paso 2: Crear tu Espacio (Space)

1. Once logged in, click on **Create space**1. Una vez logueado, haz clic en **Create space**

2. Choose a name for your space, for example: "Keysely Platform"2. Elige un nombre para tu espacio, por ejemplo: "Keysely Platform"

3. Select **Empty space**3. Selecciona **Empty space** (espacio vacío)

4. Click **Create space**4. Haz clic en **Create space**

## Step 3: Get Your API Credentials## Paso 3: Obtener tus Credenciales API

1. In your space, go to **Settings** (⚙️) at the top1. En tu espacio, ve a **Settings** (⚙️) en la parte superior

2. Click on **API keys**2. Haz clic en **API keys**

3. Click on **Add API key**3. Haz clic en **Add API key**

4. Give it a name, for example: "Keysely Frontend"4. Dale un nombre, por ejemplo: "Keysely Frontend"

5. Copy and save these values:5. Copia y guarda estos valores:
   - **Space ID** (you'll need it for VITE_CONTENTFUL_SPACE_ID) - **Space ID** (lo necesitarás para VITE_CONTENTFUL_SPACE_ID)

   - **Content Delivery API - access token** (for VITE_CONTENTFUL_ACCESS_TOKEN) - **Content Delivery API - access token** (para VITE_CONTENTFUL_ACCESS_TOKEN)

   - **Content Preview API - access token** (optional, for VITE_CONTENTFUL_PREVIEW_TOKEN) - **Content Preview API - access token** (opcional, para VITE_CONTENTFUL_PREVIEW_TOKEN)

## Step 4: Configure Environment Variables## Paso 4: Configurar Variables de Entorno

1. Copy the `.env.example` file to `.env`:1. Copia el archivo `.env.example` a `.env`:

   `bash   `bash

   cp .env.example .env cp .env.example .env

   `   `

2. Open `.env` and add your credentials:2. Abre `.env` y añade tus credenciales:

   ````env

   ```env   VITE_CONTENTFUL_SPACE_ID=tu_space_id_aqui

   VITE_CONTENTFUL_SPACE_ID=your_space_id_here   VITE_CONTENTFUL_ACCESS_TOKEN=tu_access_token_aqui

   VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here   VITE_CONTENTFUL_PREVIEW_TOKEN=tu_preview_token_aqui

   VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here   VITE_CONTENTFUL_ENVIRONMENT=master

   VITE_CONTENTFUL_ENVIRONMENT=master   ```

   ````

## Paso 5: Crear tu Primer Content Model

## Step 5: Create Your First Content Model

### Ejemplo: Space Highlight (Espacio Destacado)

### Example: Space Highlight

1. En Contentful, ve a **Content model**

1. In Contentful, go to **Content model**2. Haz clic en **Add content type**

1. Click on **Add content type**3. Configura:

1. Configure: - **Name**: Space Highlight
   - **Name**: Space Highlight - **API Identifier**: `spaceHighlight`

   - **API Identifier**: `spaceHighlight`4. Haz clic en **Create**

1. Click **Create**

1. Ahora añade campos (Add field):

1. Now add fields (Add field):

   **Campo 1: Title**

   **Field 1: Title** - Type: **Short text**
   - Type: **Short text** - Name: `Title`

   - Name: `Title` - Field ID: `title`

   - Field ID: `title` - ✓ Required

   - ✓ Required - ✓ Unique

   - ✓ Unique

   **Campo 2: Description**

   **Field 2: Description** - Type: **Long text**
   - Type: **Long text** - Name: `Description`

   - Name: `Description` - Field ID: `description`

   - Field ID: `description` - ✓ Required

   - ✓ Required

   **Campo 3: Images**

   **Field 3: Images** - Type: **Media**
   - Type: **Media** - Name: `Images`

   - Name: `Images` - Field ID: `images`

   - Field ID: `images` - ✓ Many files

   - ✓ Many files

   **Campo 4: Featured**

   **Field 4: Featured** - Type: **Boolean**
   - Type: **Boolean** - Name: `Featured`

   - Name: `Featured` - Field ID: `featured`

   - Field ID: `featured` - Default: `false`

   - Default: `false`

   **Campo 5: Display Order**

   **Field 5: Display Order** - Type: **Integer**
   - Type: **Integer** - Name: `Display Order`

   - Name: `Display Order` - Field ID: `displayOrder`

   - Field ID: `displayOrder` - Default: `0`

   - Default: `0`

   **Campo 6: Space (JSON Object)**

   **Field 6: Space (JSON Object)** - Type: **JSON object**
   - Type: **JSON object** - Name: `Space`

   - Name: `Space` - Field ID: `space`

   - Field ID: `space`

1. Haz clic en **Save** para guardar el content type

1. Click **Save** to save the content type

## Paso 6: Crear tu Primera Entrada de Contenido

## Step 6: Create Your First Content Entry

1. Ve a **Content** en la navegación superior

1. Go to **Content** in the top navigation2. Haz clic en **Add entry**

1. Click on **Add entry**3. Selecciona **Space Highlight**

1. Select **Space Highlight**4. Llena los campos:

1. Fill in the fields: - **Title**: "Oficina Moderna en Querétaro"
   - **Title**: "Modern Office in Querétaro" - **Description**: "Espacio luminoso y moderno perfecto para sesiones creativas"

   - **Description**: "Bright and modern space perfect for creative sessions" - **Images**: Sube una o varias imágenes

   - **Images**: Upload one or more images - **Featured**: Marca como ✓ (checked)

   - **Featured**: Check ✓ (checked) - **Display Order**: 1

   - **Display Order**: 1 - **Space** (JSON):

   - **Space** (JSON): ```json

     ````json {

     {       "spaceId": "123",

       "spaceId": "123",       "spaceName": "Creative Studio QRO"

       "spaceName": "Creative Studio QRO"     }

     }     ```

     ```5. Haz clic en **Publish** (no solo Save)
     ````

1. Click **Publish** (not just Save)

## Paso 7: Probar la Integración

## Step 7: Test the Integration

1. Reinicia tu servidor de desarrollo:

1. Restart your development server:

   ````bash

   ```bash   bun run dev

   bun run dev   ```

   ````

1. Añade el componente de ejemplo a tu página:

1. Add the example component to your page:

   ````typescript
   ```typescript   // En src/pages/Index.tsx
   
   // In src/pages/Index.tsx   import ContentfulExample from '../components/ContentfulExample';
   
   import ContentfulExample from '../components/ContentfulExample';
   
   const Index = () => {
   
   const Index = () => {     return (
   
     return (       <div className="min-h-screen">
   
       <div className="min-h-screen">         <Header />
   
         <Header />         <Hero />
   
         <Hero />         <ContentfulExample /> {/* 👈 Añade este componente */}
   
         <ContentfulExample /> {/* 👈 Add this component */}         <Categories />
   
         <Categories />         <FeaturedSpaces />
   
         <FeaturedSpaces />         <Footer />
   
         <Footer />       </div>
   
       </div>     );
   
     );   };
   
   };   ```;
   ````

1. Abre tu navegador en http://localhost:8080

1. Open your browser at http://localhost:80804. Deberías ver tu contenido de Contentful renderizado!

1. You should see your Contentful content rendered!

## ✅ Verificación

## ✅ Verification

Si todo está bien configurado, deberías ver:

If everything is configured correctly, you should see:

- ✅ El componente `ContentfulExample` renderizando sin errores

- ✅ The `ContentfulExample` component rendering without errors- ✅ El título y descripción de tu entrada

- ✅ The title and description of your entry- ✅ Las imágenes que subiste

- ✅ The images you uploaded- ✅ Un mensaje azul al final: "Contentful Integration Active: Displaying X featured items"

- ✅ A blue message at the end: "Contentful Integration Active: Displaying X featured items"

## 🐛 Troubleshooting

## 🐛 Troubleshooting

### No veo mi contenido

### I don't see my content

1. **Verifica que el contenido esté PUBLICADO** (Publish, no solo Save)

1. **Verify that the content is PUBLISHED** (Publish, not just Save)2. Revisa la consola del navegador para ver errores

1. Check the browser console for errors3. Verifica que las variables de entorno estén correctas

1. Verify that the environment variables are correct4. Asegúrate de haber reiniciado el servidor después de cambiar `.env`

1. Make sure you restarted the server after changing `.env`

### Error 401 o 403

### Error 401 or 403

- Tu access token es incorrecto

- Your access token is incorrect- Ve a Settings > API keys en Contentful y copia nuevamente el token

- Go to Settings > API keys in Contentful and copy the token again

### Error "Cannot find VITE_CONTENTFUL_SPACE_ID"

### Error "Cannot find VITE_CONTENTFUL_SPACE_ID"

- No copiaste `.env.example` a `.env`

- You didn't copy `.env.example` to `.env`- O no reiniciaste el servidor después de crear `.env`

- Or you didn't restart the server after creating `.env`

## 🎯 Próximos Pasos

## 🎯 Next Steps

1. **Crea más content types** siguiendo el mismo proceso

1. **Create more content types** following the same process2. **Actualiza los tipos TypeScript** en `src/integrations/contentful/types.ts`

1. **Update TypeScript types** in `src/integrations/contentful/types.ts`3. **Crea servicios** para tus nuevos content types en `services.ts`

1. **Create services** for your new content types in `services.ts`4. **Crea hooks** en `useContentful.ts` para usar en tus componentes

1. **Create hooks** in `useContentful.ts` to use in your components5. **Usa el contenido** en tus páginas y componentes

1. **Use the content** in your pages and components

## 📚 Recursos Útiles

## 📚 Useful Resources

- [Documentación de Contentful](https://www.contentful.com/developers/docs/)

- [Contentful Documentation](https://www.contentful.com/developers/docs/)- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)

- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)- [Guía de Content Modeling](https://www.contentful.com/help/content-modelling-basics/)

- [Content Modeling Guide](https://www.contentful.com/help/content-modelling-basics/)

## 💡 Tips

## 💡 Tips

- **Usa el Content Preview API** para ver contenido draft antes de publicar

- **Use the Content Preview API** to see draft content before publishing- **Organiza tu contenido** con categorías y tags

- **Organize your content** with categories and tags- **Aprovecha las referencias** entre content types (como Author → Blog Post)

- **Leverage references** between content types (like Author → Blog Post)- **Usa validaciones** en los campos para asegurar calidad de contenido

- **Use validations** on fields to ensure content quality- **Implementa i18n** en Contentful para contenido multiidioma

- **Implement i18n** in Contentful for multilingual content

¡Listo! Ahora tienes Contentful completamente integrado en tu plataforma Keysely. 🎉

Done! Now you have Contentful fully integrated in your Keysely platform. 🎉
