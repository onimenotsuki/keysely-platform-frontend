# Contentful CMS Integration

This directory contains the integration with Contentful CMS for the Ofikai platform.

## 📋 Overview

Contentful is a headless CMS that allows you to manage and deliver content through APIs. This integration uses the Content Delivery API (CDA) to fetch published content.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun add contentful
```

### 2. Configure Environment Variables

Copy the example environment file and add your Contentful credentials:

```bash
cp .env.example .env
```

Add your Contentful credentials to `.env`:

```env
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token (optional)
VITE_CONTENTFUL_ENVIRONMENT=master
```

### 3. Get Your Contentful Credentials

1. Go to [Contentful](https://app.contentful.com/)
2. Select your space
3. Go to **Settings > API keys**
4. Copy your:
   - **Space ID**
   - **Content Delivery API - access token**
   - **Content Preview API - access token** (optional, for draft content)

## 📁 File Structure

```
src/integrations/contentful/
├── client.ts          # Contentful API client configuration
├── types.ts           # TypeScript types for content models
├── services.ts        # API service functions
└── README.md          # This file

src/hooks/
└── useContentful.ts   # React Query hooks for Contentful

src/components/
└── ContentfulExample.tsx  # Example component using Contentful
```

## 🎯 Content Types

### Example Content Types Included:

1. **Blog Post** (`blogPost`)
   - Title, slug, content, excerpt
   - Featured image
   - Author and category references
   - Tags and SEO metadata

2. **Space Highlight** (`spaceHighlight`)
   - Title and description
   - Images
   - Space reference
   - Featured flag and display order

3. **Marketing Banner** (`marketingBanner`)
   - Title, subtitle, CTA
   - Background image
   - Active status with date range

4. **FAQ** (`faq`)
   - Question and answer
   - Category and order

5. **Author** (`author`)
   - Name, bio, avatar
   - Social media links

6. **Category** (`category`)
   - Name, slug, description

## 🔧 Usage

### Using React Query Hooks

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

### Using Services Directly

```typescript
import { getBlogPostBySlug } from '@/integrations/contentful/services';

const post = await getBlogPostBySlug('my-blog-post');
console.log(post?.fields.title);
```

## 🎨 Creating Content in Contentful

### Step 1: Create a Content Model

1. Go to **Content model** in Contentful
2. Click **Add content type**
3. Add fields matching the TypeScript interfaces in `types.ts`

Example for Space Highlight:

```
Content Type ID: spaceHighlight

Fields:
- title (Short text, required)
- description (Long text, required)
- images (Media, multiple files)
- featured (Boolean)
- displayOrder (Integer)
- space (JSON object with spaceId and spaceName)
```

### Step 2: Create Content

1. Go to **Content** in Contentful
2. Click **Add entry**
3. Select your content type
4. Fill in the fields
5. Click **Publish**

## 📚 API Reference

### Available Hooks

- `useBlogPosts()` - Get all blog posts
- `useBlogPost(slug)` - Get single blog post by slug
- `useSpaceHighlights()` - Get all space highlights
- `useFeaturedSpaceHighlights()` - Get featured space highlights only
- `useActiveMarketingBanners()` - Get active marketing banners
- `useFAQs()` - Get all FAQs
- `useFAQsByCategory(category)` - Get FAQs by category

### Available Services

- `getAllBlogPosts()`
- `getBlogPostBySlug(slug)`
- `getSpaceHighlights()`
- `getFeaturedSpaceHighlights()`
- `getSpaceHighlightById(id)`
- `getActiveMarketingBanners()`
- `getAllFAQs()`
- `getFAQsByCategory(category)`

## 🔐 Authentication

The integration uses the **Content Delivery API (CDA)** which requires:

- Space ID
- Access Token (Content Delivery API token)

For preview/draft content, you can use the **Content Preview API**:

- Same Space ID
- Preview API Token

## 📖 Resources

- [Contentful Docs](https://www.contentful.com/developers/docs/)
- [Content Delivery API Reference](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Contentful SDK for JavaScript](https://github.com/contentful/contentful.js)
- [TanStack Query Docs](https://tanstack.com/query/latest)

## 🎓 Example Component

Check out `src/components/ContentfulExample.tsx` for a complete example of:

- Loading states
- Error handling
- Rendering Contentful content
- Displaying images from Contentful

## 🚨 Troubleshooting

### "Cannot find VITE_CONTENTFUL_SPACE_ID"

Make sure you have copied `.env.example` to `.env` and filled in your Contentful credentials.

### "403 Forbidden" or "401 Unauthorized"

Check that your access token is correct and has the right permissions.

### Content not showing up

1. Make sure content is **published** in Contentful (not just saved as draft)
2. Check that the `content_type` in services matches your Contentful content type ID
3. Verify your environment is set correctly (default is "master")

## 🎯 Next Steps

1. Create your content models in Contentful
2. Update `types.ts` to match your content models
3. Create service functions in `services.ts` for your content types
4. Create React Query hooks in `useContentful.ts`
5. Use the hooks in your components!

## 📝 Notes

- Content is cached using TanStack Query (React Query)
- Default cache time: 5-15 minutes depending on content type
- Images from Contentful need `https:` prepended to URLs
- Use the Preview API client for draft content previews
