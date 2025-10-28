# Usage Guide: Hero Banner with Contentful

## 📋 Summary

You have successfully integrated the `HeroBannerContentful` component that fetches dynamic content from Contentful CMS. This component displays a hero banner with background images and CTA text managed from Contentful.

---

## ✅ Updated/Created Files

### 1. **Contentful Types** (`src/integrations/contentful/types.ts`)

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

**✨ Key Changes:**

- `images?: Asset[]` - Correct type for "Media, many files" fields in Contentful
- `Asset` is the official Contentful SDK type for media files

---

### 2. **Contentful Service** (`src/integrations/contentful/services.ts`)

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

**✨ Key Changes:**

- Uses `getEntries()` with `content_type` filter (correct per Contentful docs)
- `getEntry()` requires an entry ID, NOT a content type name
- Returns `null` on error for graceful handling

---

### 3. **React Query Hook** (`src/hooks/useContentful.ts`)

```typescript
export const useHeroBanner = () => {
  return useQuery({
    queryKey: ['contentful', 'heroBanner'],
    queryFn: getHeroBanner,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry 2 times on failure
  });
};
```

**✨ Features:**

- 10-minute cache for performance optimization
- Automatic retries (2x) on network failures
- Perfect integration with TanStack Query

---

### 4. **React Component** (`src/components/HeroBannerContentful.tsx`)

Complete component with:

- ✅ Loading state (skeleton)
- ✅ Error handling
- ✅ Empty state (no content)
- ✅ Background image rendering
- ✅ Dynamic CTA from Contentful
- ✅ Additional image gallery
- ✅ Integrated search bar
- ✅ Debug info (for development)

---

## 🎯 How to Use the Component

### Step 1: Create Content Type in Contentful

1. **Go to your Contentful Space** → Content model → Add content type
2. **Name:** `Hero Banner`
3. **API Identifier:** `heroBanner` (must be exactly this)

4. **Add the following fields:**

   **Field 1: CTA Text**
   - **Field ID:** `cta`
   - **Type:** Short text
   - **Required:** Yes
   - **Help text:** "The main text of the Hero Banner (e.g., 'Find Your Perfect Workspace')"

   **Field 2: Images**
   - **Field ID:** `images`
   - **Type:** Media (Many files)
   - **Validation:** Accept only images
   - **Required:** No
   - **Help text:** "Hero Banner images. The first one will be the main background."

5. **Save the content type**

---

### Step 2: Create a Hero Banner Entry

1. **Content → Add entry → Hero Banner**
2. **CTA:** Write your main text, example:

   ```text
   Find Your Perfect Workspace
   ```

   or in Spanish:

   ```text
   Encuentra tu Espacio de Trabajo Perfecto
   ```

3. **Images:** Upload 1-3 high-quality images
   - **First image:** Will be used as hero background (recommended: 1920x1080px)
   - **Additional images:** Will be shown in the gallery below

4. **Publish** the entry

---

### Step 3: Use the Component in Your App

**Option A: Replace Current Hero**

In `src/pages/Index.tsx`:

```typescript
import HeroBannerContentful from '../components/HeroBannerContentful';

const Index = () => {
  return (
    <>
      <HeroBannerContentful />  {/* Replaces <Hero /> */}
      <FeaturedSpaces />
      <Categories />
      {/* ... rest of components */}
    </>
  );
};
```

**Option B: Use Conditionally**

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

## 🔧 Environment Variables Configuration

Make sure you have these variables in your `.env`:

```bash
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here

# Optional: For preview mode
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token_here
VITE_CONTENTFUL_ENVIRONMENT=master
```

**Where to find these values:**

1. **Contentful Dashboard** → Settings → API keys
2. Create a new API key if you don't have one
3. Copy:
   - **Space ID**
   - **Content Delivery API - access token**
   - **Content Preview API - access token** (optional)

---

## 📊 Contentful Data Structure

When you fetch the Hero Banner, you get this object:

```typescript
{
  sys: {
    id: "abc123",
    type: "Entry",
    contentType: { sys: { id: "heroBanner" } },
    createdAt: "2024-01-15T10:00:00Z",
    // ... more metadata
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
      // ... more images
    ]
  }
}
```

---

## 🎨 Component Customization

### Change Search Design

In `HeroBannerContentful.tsx`, line ~97:

```typescript
{/* Search Card - Keep your existing search functionality */}
<div className="bg-white rounded-2xl shadow-2xl p-8">
  {/* Customize inputs here */}
</div>
```

### Add More Fields from Contentful

1. **Add the field in Contentful:**

   ```text
   Field: subtitle
   Type: Short text
   ```

2. **Update the TypeScript type:**

   ```typescript
   // src/integrations/contentful/types.ts
   export interface HeroBannerSkeleton extends EntrySkeletonType {
     contentTypeId: 'heroBanner';
     fields: {
       cta: string;
       subtitle?: string; // ← New field
       images?: Asset[];
     };
   }
   ```

3. **Use it in the component:**

   ```typescript
   const subtitle: string = fields.subtitle || t('hero.subtitle');

   <p className="text-white/90 text-xl md:text-2xl mb-12">
     {subtitle}
   </p>
   ```

### Remove Debug Info

In production, delete this block (line ~150):

```typescript
{/* Contentful Debug Info (remove in production) */}
<div className="mt-8 p-4 bg-blue-900/50 backdrop-blur-sm rounded-lg">
  {/* ... */}
</div>
```

---

## 🧪 Testing

### 1. **Verify the hook works:**

```typescript
// In any component
import { useHeroBanner } from '../hooks/useContentful';

const TestComponent = () => {
  const { data, isLoading, error } = useHeroBanner();

  console.log('Hero Banner:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  return <div>Check console</div>;
};
```

### 2. **Verify images:**

Contentful URLs should look like this:

```text
//images.ctfassets.net/YOUR_SPACE_ID/abc123/hero-image.jpg
```

If you see URLs without `https:`, the component already handles adding the prefix.

---

## 🐛 Troubleshooting

### Error: "No hero banner configured"

- ✅ Verify you've published the entry in Contentful
- ✅ Check that the Content Type is named exactly `heroBanner`
- ✅ Confirm environment variables are correct

### Error: "Error loading hero banner from Contentful"

- ✅ Verify your Space ID and Access Token in `.env`
- ✅ Make sure to restart the dev server after changing `.env`
- ✅ Check browser console for more details

### Images don't show

- ✅ Verify images are published in Contentful
- ✅ Check that the field is named `images` (plural)
- ✅ Inspect the response in the browser's Network tab

### TypeScript errors

- ✅ Make sure you have `contentful` installed: `bun add contentful`
- ✅ Restart the TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

---

## 📚 Additional Resources

- [Contentful Content Delivery API Docs](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Contentful Asset Type Reference](https://contentful.github.io/contentful.js/interfaces/Asset.html)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)

---

## 🚀 Recommended Next Steps

1. ✅ **Create your Hero Banner in Contentful** with text and images
2. ✅ **Test the component** in your local app
3. ⏳ **Add more fields** (subtitle, button text, etc.)
4. ⏳ **Implement i18n** for multiple languages in Contentful
5. ⏳ **Integrate real search functionality**
6. ⏳ **Optimize images** with Contentful Image API

---

All set! 🎉 Your Hero Banner is now connected to Contentful CMS and you can edit it without touching code.
