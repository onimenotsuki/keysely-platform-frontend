# 🚀 Quick Guide: Setting Up Contentful CMS for Keysely# 🚀 Quick Guide: Setting Up Contentful CMS for Keysely# 🚀 Quick Guide: Setting Up Contentful CMS for Keysely# 🚀 Guía Rápida: Configurar Contentful CMS para Keysely

## Step 1: Create a Contentful Account

1. Go to [https://www.contentful.com/](https://www.contentful.com/)## Step 1: Create a Contentful Account## Step 1: Create a Contentful Account## Paso 1: Crear una Cuenta en Contentful

2. Click on **Sign up** or **Get started free**

3. Create your account (you can use GitHub, Google, or email)

4. Contentful offers a free plan to get started

5. Go to [https://www.contentful.com/](https://www.contentful.com/)1. Go to [https://www.contentful.com/](https://www.contentful.com/)1. Ve a [https://www.contentful.com/](https://www.contentful.com/)

## Step 2: Create Your Space

2. Click on **Sign up** or **Get started free**

1. Once logged in, click on **Create space**

1. Choose a name for your space, for example: "Keysely Platform"3. Create your account (you can use GitHub, Google, or email)2. Click on **Sign up** or **Get started free**2. Haz clic en **Sign up** o **Get started free**

1. Select **Empty space**

1. Click **Create space**4. Contentful offers a free plan to get started

## Step 3: Get Your API Credentials3. Create your account (you can use GitHub, Google, or email)

1. In your space, go to **Settings** (⚙️) at the top## Step 2: Create Your Space

2. Click on **API keys**

3. Click on **Add API key**4. Contentful offers a free plan to get started4. Contentful ofrece un plan gratuito para empezar

4. Give it a name, for example: "Keysely Frontend"

5. Copy and save these values:1. Once logged in, click on **Create space**
   - **Space ID** (you'll need it for VITE_CONTENTFUL_SPACE_ID)

   - **Content Delivery API - access token** (for VITE_CONTENTFUL_ACCESS_TOKEN)2. Choose a name for your space, for example: "Keysely Platform"## Step 2: Create Your Space## Paso 2: Crear tu Espacio (Space)

   - **Content Preview API - access token** (optional, for VITE_CONTENTFUL_PREVIEW_TOKEN)

6. Select **Empty space**

## Step 4: Configure Environment Variables

4. Click **Create space**1. Once logged in, click on **Create space**

1. Copy the `.env.example` file to `.env`:

   ```bash

   cp .env.example .env## Step 3: Get Your API Credentials2. Choose a name for your space, for example: "Keysely Platform"Platform"

   ```

1. Open `.env` and add your credentials:

1. In your space, go to **Settings** (⚙️) at the top3. Select **Empty space**

   ````env

   VITE_CONTENTFUL_SPACE_ID=your_space_id_here2. Click on **API keys**

   VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here

   VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here3. Click on **Add API key**4. Click **Create space**

   VITE_CONTENTFUL_ENVIRONMENT=master

   ```4. Give it a name, for example: "Keysely Frontend"
   ````

## Step 5: Create Your First Content Model5. Copy and save these values:## Step 3: Get Your API Credentials##

### Example: Space Highlight - **Space ID** (you'll need it for VITE_CONTENTFUL_SPACE_ID)

1. In Contentful, go to **Content model** - **Content Delivery API - access token** (for VITE_CONTENTFUL_ACCESS_TOKEN)1. In your space, go to **Settings** (⚙️) at the top1.

2. Click on **Add content type**

3. Configure: - **Content Preview API - access token** (optional, for VITE_CONTENTFUL_PREVIEW_TOKEN)
   - **Name**: Space Highlight

   - **API Identifier**: `spaceHighlight`2. Click on **API keys**

4. Click **Create**

## Step 4: Configure Environment Variables

5. Now add fields (Add field):

6. Click on **Add API key**

   **Field 1: Title**
   - Type: **Short text**1. Copy the `.env.example` file to `.env`:

   - Name: `Title`

   - Field ID: `title`4. Give it a name, for example: "Keysely Frontend"

   - ✓ Required

   - ✓ Unique ```bash

   **Field 2: Description** cp .env.example .env5. Copy and save these values:5. Copia y guarda estos valores:
   - Type: **Long text**

   - Name: `Description` ``` - **Space ID** (you'll need it for VITE_CONTENTFUL_SPACE_ID) - **Space ID**

   - Field ID: `description`

   - ✓ Required

   **Field 3: Images**2. Open `.env` and add your credentials: - **Content Delivery API - access token** (for VITE_CONTENTFUL_ACCESS_TOKEN) - **Content Delivery API - access token** (para VITE_CONTENTFUL_ACCESS_TOKEN)
   - Type: **Media**

   - Name: `Images`

   - Field ID: `images`

   - ✓ Many files ```env - **Content Preview API - access token** (optional, for VITE_CONTENTFUL_PREVIEW_TOKEN) - **Content Preview API - access token** (opcional, para VITE_CONTENTFUL_PREVIEW_TOKEN)

   **Field 4: Featured** VITE_CONTENTFUL_SPACE_ID=your_space_id_here
   - Type: **Boolean**

   - Name: `Featured` VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here## Step 4: Configure Environment Variables## Paso 4: Configurar Variables de Entorno

   - Field ID: `featured`

   - Default: `false` VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here

   **Field 5: Display Order** VITE_CONTENTFUL_ENVIRONMENT=master1. Copy the `.env.example` file to `.env`:1. Copia el archivo `.env.example` a `.env`:
   - Type: **Integer**

   - Name: `Display Order` ```

   - Field ID: `displayOrder`

   - Default: `0` `bash   `bash

   **Field 6: Space (JSON Object)**## Step 5: Create Your First Content Model
   - Type: **JSON object**

   - Name: `Space` cp .env.example .env cp .env.example .env

   - Field ID: `space`

### Example: Space Highlight

6. Click **Save** to save the content type

   `   `

## Step 6: Create Your First Content Entry

1. In Contentful, go to **Content model**

1. Go to **Content** in the top navigation

1. Click on **Add entry**2. Click on **Add content type**2. Open `.env` and add your credentials:2. Abre `.env` y añade tus credenciales:

1. Select **Space Highlight**

1. Fill in the fields:3. Configure:
   - **Title**: "Modern Office in Querétaro"

   - **Description**: "Bright and modern space perfect for creative sessions" - **Name**: Space Highlight ````env

   - **Images**: Upload one or more images

   - **Featured**: Check ✓ (checked) - **API Identifier**: `spaceHighlight`

   - **Display Order**: 1

   - **Space** (JSON):4. Click **Create** ```env VITE_CONTENTFUL_SPACE_ID=tu_space_id_aqui

     ```json

     {

       "spaceId": "123",

       "spaceName": "Creative Studio QRO"5. Now add fields (Add field):   VITE_CONTENTFUL_SPACE_ID=your_space_id_here   VITE_CONTENTFUL_ACCESS_TOKEN=tu_access_token_aqui

     }

     ```

1. Click **Publish** (not just Save)

   **Field 1: Title** VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here VITE_CONTENTFUL_PREVIEW_TOKEN=tu_preview_token_aqui

## Step 7: Test the Integration

- Type: **Short text**

1. Restart your development server:
   - Name: `Title` VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here VITE_CONTENTFUL_ENVIRONMENT=master

   ```bash

   bun run dev   - Field ID: `title`

   ```

   - ✓ Required VITE_CONTENTFUL_ENVIRONMENT=master ```

2. Add the example component to your page:
   - ✓ Unique

   `````typescript

   // In src/pages/Index.tsx   ````

   import ContentfulExample from '../components/ContentfulExample';

   **Field 2: Description**

   const Index = () => {

     return (   - Type: **Long text**## Paso 5: Crear tu Primer Content Model

       <div className="min-h-screen">

         <Header />   - Name: `Description`

         <Hero />

         <ContentfulExample /> {/* 👈 Add this component */}   - Field ID: `description`## Step 5: Create Your First Content Model

         <Categories />

         <FeaturedSpaces />   - ✓ Required

         <Footer />

       </div>### Ejemplo: Space Highlight (Espacio Destacado)

     );

   };   **Field 3: Images**

   `````

   - Type: **Media**### Example: Space Highlight

3. Open your browser at http://localhost:8080

4. You should see your Contentful content rendered! - Name: `Images`

## ✅ Verification - Field ID: `images`1. En Contentful, ve a **Content model**

If everything is configured correctly, you should see: - ✓ Many files

- ✅ The `ContentfulExample` component rendering without errors1. In Contentful, go to **Content model**2. Haz clic en **Add content type**

- ✅ The title and description of your entry

- ✅ The images you uploaded **Field 4: Featured**

- ✅ A blue message at the end: "Contentful Integration Active: Displaying X featured items"
  - Type: **Boolean**1. Click on **Add content type**3. Configura:

## 🐛 Troubleshooting

- Name: `Featured`

### I don't see my content

- Field ID: `featured`1. Configure: - **Name**: Space Highlight

1. **Verify that the content is PUBLISHED** (Publish, not just Save)

2. Check the browser console for errors - Default: `false` - **Name**: Space Highlight - **API Identifier**: `spaceHighlight`

3. Verify that the environment variables are correct

4. Make sure you restarted the server after changing `.env`

### Error 401 or 403 **Field 5: Display Order** - **API Identifier**: `spaceHighlight`4. Haz clic en **Create**

- Your access token is incorrect - Type: **Integer**

- Go to Settings > API keys in Contentful and copy the token again
  - Name: `Display Order`1. Click **Create**

### Error "Cannot find VITE_CONTENTFUL_SPACE_ID"

- Field ID: `displayOrder`

- You didn't copy `.env.example` to `.env`

- Or you didn't restart the server after creating `.env` - Default: `0`1. Ahora añade campos (Add field):

## 🎯 Next Steps

1. **Create more content types** following the same process **Field 6: Space (JSON Object)**1. Now add fields (Add field):

2. **Update TypeScript types** in `src/integrations/contentful/types.ts`

3. **Create services** for your new content types in `services.ts` - Type: **JSON object**

4. **Create hooks** in `useContentful.ts` to use in your components

5. **Use the content** in your pages and components - Name: `Space` **Campo 1: Title**

## 📚 Useful Resources - Field ID: `space`

- [Contentful Documentation](https://www.contentful.com/developers/docs/) **Field 1: Title** - Type: **Short text**

- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)

- [Content Modeling Guide](https://www.contentful.com/help/content-modelling-basics/)6. Click **Save** to save the content type - Type: **Short text** - Name: `Title`

## 💡 Tips

- **Use the Content Preview API** to see draft content before publishing## Step 6: Create Your First Content Entry - Name: `Title` - Field ID: `title`

- **Organize your content** with categories and tags

- **Leverage references** between content types (like Author → Blog Post)

- **Use validations** on fields to ensure content quality

- **Implement i18n** in Contentful for multilingual content1. Go to **Content** in the top navigation - Field ID: `title` - ✓ Required

Done! Now you have Contentful fully integrated in your Keysely platform. 🎉2. Click on **Add entry**

3. Select **Space Highlight** - ✓ Required - ✓ Unique

4. Fill in the fields:
   - **Title**: "Modern Office in Querétaro" - ✓ Unique

   - **Description**: "Bright and modern space perfect for creative sessions"

   - **Images**: Upload one or more images **Campo 2: Description**

   - **Featured**: Check ✓ (checked)

   - **Display Order**: 1 **Field 2: Description** - Type: **Long text**

   - **Space** (JSON): - Type: **Long text** - Name: `Description`

     ````json

     {   - Name: `Description` - Field ID: `description`

       "spaceId": "123",

       "spaceName": "Creative Studio QRO"   - Field ID: `description` - ✓ Required

     }

     ```   - ✓ Required
     ````

5. Click **Publish** (not just Save)

   **Campo 3: Images**

## Step 7: Test the Integration

**Field 3: Images** - Type: **Media**

1. Restart your development server: - Type: **Media** - Name: `Images`

   ```bash   - Name: `Images`- Field ID:`images`

   bun run dev

   ```  - Field ID:`images` - ✓ Many files

2. Add the example component to your page: - ✓ Many files

   ````typescript **Campo 4: Featured**

   // In src/pages/Index.tsx

   import ContentfulExample from '../components/ContentfulExample';   **Field 4: Featured** - Type: **Boolean**

   - Type: **Boolean** - Name: `Featured`

   const Index = () => {

     return (   - Name: `Featured` - Field ID: `featured`

       <div className="min-h-screen">

         <Header />   - Field ID: `featured` - Default: `false`

         <Hero />

         <ContentfulExample /> {/* 👈 Add this component */}   - Default: `false`

         <Categories />

         <FeaturedSpaces />   **Campo 5: Display Order**

         <Footer />

       </div>   **Field 5: Display Order** - Type: **Integer**

     );   - Type: **Integer** - Name: `Display Order`

   };

   ```   - Name: `Display Order` - Field ID: `displayOrder`

   ````

3. Open your browser at http://localhost:8080 - Field ID: `displayOrder` - Default: `0`

4. You should see your Contentful content rendered!
   - Default: `0`

## ✅ Verification

**Campo 6: Space (JSON Object)**

If everything is configured correctly, you should see:

**Field 6: Space (JSON Object)** - Type: **JSON object**

- ✅ The `ContentfulExample` component rendering without errors - Type: **JSON object** - Name: `Space`

- ✅ The title and description of your entry

- ✅ The images you uploaded - Name: `Space` - Field ID: `space`

- ✅ A blue message at the end: "Contentful Integration Active: Displaying X featured items"
  - Field ID: `space`

## 🐛 Troubleshooting

1. Haz clic en **Save** para guardar el content type

### I don't see my content

1. Click **Save** to save the content type

1. **Verify that the content is PUBLISHED** (Publish, not just Save)

1. Check the browser console for errors## Paso 6: Crear tu Primera Entrada de Contenido

1. Verify that the environment variables are correct

1. Make sure you restarted the server after changing `.env`## Step 6: Create Your First Content Entry

### Error 401 or 4031. Ve a **Content** en la navegación superior

- Your access token is incorrect1. Go to **Content** in the top navigation2. Haz clic en **Add entry**

- Go to Settings > API keys in Contentful and copy the token again

1. Click on **Add entry**3. Selecciona **Space Highlight**

### Error "Cannot find VITE_CONTENTFUL_SPACE_ID"

1. Select **Space Highlight**4. Llena los campos:

- You didn't copy `.env.example` to `.env`

- Or you didn't restart the server after creating `.env`1. Fill in the fields: - **Title**: "Oficina Moderna en Querétaro"
  - **Title**: "Modern Office in Querétaro" - **Description**: "Espacio luminoso y moderno perfecto para sesiones creativas"

## 🎯 Next Steps

- **Description**: "Bright and modern space perfect for creative sessions" - **Images**: Sube una o varias imágenes

1. **Create more content types** following the same process

2. **Update TypeScript types** in `src/integrations/contentful/types.ts` - **Images**: Upload one or more images - **Featured**: Marca como ✓ (checked)

3. **Create services** for your new content types in `services.ts`

4. **Create hooks** in `useContentful.ts` to use in your components - **Featured**: Check ✓ (checked) - **Display Order**: 1

5. **Use the content** in your pages and components
   - **Display Order**: 1 - **Space** (JSON):

## 📚 Useful Resources

- **Space** (JSON): ```json

- [Contentful Documentation](https://www.contentful.com/developers/docs/)

- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) ````json {

- [Content Modeling Guide](https://www.contentful.com/help/content-modelling-basics/)

  { "spaceId": "123",

## 💡 Tips

       "spaceId": "123",       "spaceName": "Creative Studio QRO"

- **Use the Content Preview API** to see draft content before publishing

- **Organize your content** with categories and tags "spaceName": "Creative Studio QRO" }

- **Leverage references** between content types (like Author → Blog Post)

- **Use validations** on fields to ensure content quality } ```

- **Implement i18n** in Contentful for multilingual content

  ```5. Haz clic en **Publish** (no solo Save)

  ```

Done! Now you have Contentful fully integrated in your Keysely platform. 🎉 ````

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
