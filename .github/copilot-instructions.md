# Keysely Platform Frontend - GitHub Copilot Instructions

## ⚠️ IMPORTANT: Keeping This File Updated

**CRITICAL INSTRUCTION FOR AI ASSISTANTS:**

Whenever you make any of the following changes to the codebase, you MUST update this `copilot-instructions.md` file accordingly:

1. **Infrastructure Changes:**
   - Adding/removing dependencies (package.json)
   - Changing build configuration (vite.config.ts, tsconfig.json)
   - Modifying environment variables (.env structure)
   - Database schema changes (Supabase migrations)
   - API integrations (new services, endpoints)

2. **New Features:**
   - New major components or pages
   - New routing patterns
   - New state management patterns
   - New hooks or utilities
   - New API integrations (Contentful, Stripe, etc.)

3. **Architectural Changes:**
   - Directory structure modifications
   - Design system updates
   - Coding convention changes
   - New best practices

4. **Documentation Updates:**
   - Update the relevant sections (Technology Stack, Build Instructions, Architecture, etc.)
   - Add new sections if needed
   - Keep code examples current
   - Update file paths if they change

**HOW TO UPDATE:**

- Read the entire file first to understand the structure
- Locate the relevant section
- Update or add information
- Keep the format consistent
- Ensure examples are accurate

---

## Project Overview

Keysely is a workspace marketplace platform that allows users to discover, book, and manage office spaces, meeting rooms, and coworking spaces. The frontend is built with modern React/TypeScript stack featuring a responsive, bilingual (English/Spanish) interface with real-time functionality.

**Key Features:**

- Space discovery and booking system
- User authentication and profiles
- Real-time messaging between users and space owners
- Payment processing with Stripe
- Review and rating system
- Responsive design with dark/light mode
- Bilingual support (English/Spanish)

## Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **State Management:** TanStack Query (React Query), React Context
- **Routing:** React Router DOM v6
- **Backend Integration:** Supabase (PostgreSQL, Auth, Real-time)
- **CMS:** Contentful (Headless CMS for dynamic content)
- **Payment:** Stripe integration
- **Form Handling:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Build Tool:** Vite with SWC
- **Package Manager:** Bun (preferred over npm/yarn)
- **Code Quality:** ESLint, Prettier, Husky pre-commit hooks
- **Commit Convention:** Commitizen for conventional commits

## Build Instructions

### Prerequisites

- Node.js 18+ or Bun (preferred)
- Modern web browser

### Environment Setup

1. **Always copy environment variables first:**

   ```bash
   cp .env.example .env
   ```

   Then configure required Supabase and Stripe variables.

2. **Install dependencies:**
   ```bash
   bun install
   # or if bun not available: npm install
   ```

### Development Commands

- **Start development server:** `bun dev` (or `npm run dev`)
  - Runs on http://localhost:8080
  - Hot reload enabled
- **Build for production:** `bun run build` (or `npm run build`)
- **Build for development:** `bun run build:dev`
- **Preview production build:** `bun run preview`
- **Lint code:** `bun run lint`
- **Format code:** `bun run format` (or `npm run format`)
- **Commit with Commitizen:** `bun run commit` (or `npm run commit`)

### Testing & Validation

- ESLint is configured with TypeScript, React hooks, and React refresh plugins
- Prettier is configured for consistent code formatting
- Husky pre-commit hooks automatically run linting and formatting checks
- Always run `bun run lint` and `bun run format` before committing (or use `bun run commit` for guided commits)
- Build both development and production modes to catch configuration issues
- Test responsive design on mobile, tablet, and desktop viewports

### Code Quality & Git Workflow

- **Commitizen** is configured for conventional commit messages
- **Husky** provides pre-commit hooks that automatically:
  - Run ESLint to check code quality
  - Run Prettier to format code
  - Ensure all staged files meet quality standards
- Use `bun run commit` instead of `git commit` for guided conventional commits

## Project Architecture & Layout

### Directory Structure

```
/src
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── chat/            # Chat-related components
│   ├── layout/          # Layout components
│   ├── features/        # Feature-specific components
│   └── *.tsx            # Other feature components
├── contexts/            # React contexts (Auth, Language)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   ├── supabase/        # Supabase client and types
│   └── contentful/      # Contentful CMS client and types
├── lib/                 # Utility functions
├── locales/             # Internationalization (en.json, es.json)
├── pages/               # Route components
├── utils/               # Helper utilities
└── docs/                # 📖 Technical documentation
    ├── DATABASE_DIAGRAMS.md      # Complete DB schema with UML
    ├── DESIGN_SYSTEM.md          # Design system guide
    ├── CODE_QUALITY_GUIDE.md     # Code standards
    ├── CONTENTFUL_SETUP.md       # CMS setup guide
    └── HEROBANNER_USAGE.md       # Hero component usage

/.github/                # GitHub workflows and templates
/public/                 # Static assets
/supabase/              # Supabase configuration and migrations
```

### Documentation Organization

All technical documentation is now centralized in `src/docs/`:

- **DATABASE_DIAGRAMS.md** - Complete database schema with:
  - Mermaid UML diagram showing all table relationships
  - Detailed field descriptions for each table
  - RLS policies and security rules
  - Indexes and performance optimizations
  - Storage buckets configuration
  - Triggers and functions
  - Migration history

- **DESIGN_SYSTEM.md** - Brand guidelines and UI patterns
- **CODE_QUALITY_GUIDE.md** - Development standards and best practices
- **CONTENTFUL_SETUP.md** - Step-by-step CMS configuration guide
- **HEROBANNER_USAGE.md** - Hero Banner component implementation guide

**Quick Access:**

- For database questions → Check `src/docs/DATABASE_DIAGRAMS.md`
- For styling questions → Check `src/docs/DESIGN_SYSTEM.md`
- For code standards → Check `src/docs/CODE_QUALITY_GUIDE.md`
- For CMS integration → Check `src/docs/CONTENTFUL_SETUP.md`

### Key Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `components.json` - shadcn/ui configuration

## Coding Standards & Conventions

### Component Patterns

- **Use functional components with hooks exclusively**
- **Export components as default exports**
- **Use TypeScript interfaces for all component props**
- **Implement proper error boundaries where needed**

### File Naming

- Components: PascalCase (e.g., `SpaceCard.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useSpaces.ts`)
- Utilities: camelCase (e.g., `utils.ts`)
- Pages: PascalCase (e.g., `SpaceDetail.tsx`)

### TypeScript Guidelines

- Always define interfaces for component props
- Use strict TypeScript configuration
- Leverage Supabase generated types from `integrations/supabase/types.ts`
- Leverage Contentful types from `integrations/contentful/types.ts`
- Prefer type unions over enums for simple values
- **For Contentful integrations:**
  - Use `EntrySkeletonType` for content model definitions
  - Use `Asset` type for media fields (not `Entry<>`)
  - Use `Entry<YourSkeleton>` for the final type
  - Always handle optional fields with `?.` and provide fallbacks
  - Type cast fields safely when needed: `const cta = fields.cta as string;`

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS custom properties for theming (defined in `index.css`)
- Leverage shadcn/ui components for consistency
- Use `cn()` utility from `lib/utils.ts` for conditional classes

### State Management

- Use TanStack Query for server state
- Use React Context for global client state (Auth, Language)
- Custom hooks for component-specific logic
- Local state with useState for component-specific data
- **For Contentful data:**
  - Always use TanStack Query hooks (defined in `hooks/useContentful.ts`)
  - Set appropriate `staleTime` (recommended: 10 minutes for CMS content)
  - Add `retry` logic for better UX (recommended: 2 retries)
  - Cache keys should follow pattern: `['contentful', 'contentType']`

## Key Architectural Patterns

### Authentication Flow

- Supabase Auth integration via `AuthContext`
- Protected routes using `ProtectedRoute` component
- Automatic session management with localStorage persistence

### Internationalization

- Context-based language switching (`LanguageContext`)
- JSON-based translations in `/locales`
- Use `useTranslation` hook for text rendering

### Data Fetching

- TanStack Query for all API calls
- Custom hooks pattern (e.g., `useSpaces`, `useBookings`)
- Optimistic updates for user interactions
- Real-time subscriptions via Supabase

### Form Handling

- React Hook Form with Zod schema validation
- Consistent error handling and display
- Form components from shadcn/ui

## Integration Points

### Supabase Integration

- Client configured in `integrations/supabase/client.ts`
- Row Level Security (RLS) policies implemented on all tables
- Real-time subscriptions for messages and notifications
- File upload for space images via Storage buckets
- **Database Schema:** See complete documentation in [`src/docs/DATABASE_DIAGRAMS.md`](../src/docs/DATABASE_DIAGRAMS.md)
  - Full UML diagram with all table relationships
  - Detailed field descriptions and constraints
  - RLS policies, triggers, and indexes
  - Migration history and storage configuration

**Key Database Tables:**

- `profiles` - User profiles (auto-created via trigger)
- `spaces` - Workspace listings with pricing and availability
- `bookings` - Reservations with Stripe payment tracking
- `reviews` - Rating and review system
- `conversations` + `messages` - Real-time chat system
- `favorites` - User favorites
- `stripe_connect_accounts` - Payment accounts for space owners
- `notifications` - System notifications
- `categories` - Space categorization

**Data Flow:**

1. User registers → `auth.users` → trigger creates `profiles` entry
2. Owner lists space → `spaces` table with RLS protection
3. User books space → `bookings` + Stripe payment processing
4. Chat initiated → `conversations` + `messages` with realtime sync
5. Review submitted → `reviews` table updates space rating

For detailed schema, relationships, and policies, always refer to `src/docs/DATABASE_DIAGRAMS.md`.

### Stripe Integration

- Marketplace payments via Supabase Edge Functions
- Connect accounts for space owners
- Webhook handling for payment status

### Contentful CMS Integration

**Purpose:** Headless CMS for managing dynamic content (hero banners, blog posts, FAQs, marketing materials)

**Architecture:**

- Client configured in `integrations/contentful/client.ts`
- TypeScript types defined in `integrations/contentful/types.ts`
- Service functions in `integrations/contentful/services.ts`
- React Query hooks in `hooks/useContentful.ts`
- Centralized exports in `integrations/contentful/index.ts`

**Configuration:**

```bash
# Required environment variables
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_cda_token
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token  # Optional
VITE_CONTENTFUL_ENVIRONMENT=master                # Optional
```

**Available Content Models:**

1. **Hero Banner** (`heroBanner`) - Dynamic hero section with CTA and images
2. **Blog Post** (`blogPost`) - Blog articles with author and categories
3. **FAQ** (`faq`) - Frequently asked questions
4. **Author** (`author`) - Content authors/contributors
5. **Category** (`category`) - Content categorization
6. **Space Highlight** (`spaceHighlight`) - Featured workspace highlights
7. **Marketing Banner** (`marketingBanner`) - Promotional content

**Key Components:**

- `HeroBannerContentful.tsx` - Example implementation of Contentful-powered hero
- `ContentfulExample.tsx` - Demo component showing various content types

**Documentation:**

- `CONTENTFUL_SETUP.md` - Complete setup guide
- `HEROBANNER_USAGE.md` - Hero Banner implementation guide
- `src/integrations/contentful/README.md` - Technical API documentation

**Best Practices:**

- Always use TypeScript skeleton types for type safety
- Use `getEntries()` with `content_type` filter to fetch by content type
- Use `getEntry()` only when you have a specific entry ID
- Leverage TanStack Query for caching (10 min stale time recommended)
- Handle loading/error/empty states in components
- Images are `Asset[]` type, access via `asset.fields.file.url`
- Prefix image URLs with `https:` (Contentful returns protocol-relative URLs)

**Common Patterns:**

_Fetching Content:_

```typescript
// In services file
export const getHeroBanner = async (): Promise<HeroBanner | null> => {
  const response = await contentfulClient.getEntries<HeroBannerSkeleton>({
    content_type: 'heroBanner',
    limit: 1,
    order: ['-sys.createdAt'],
  });
  return response.items[0] || null;
};
```

_Using in Components:_

```typescript
import { useHeroBanner } from '../hooks/useContentful';

const MyComponent = () => {
  const { data, isLoading, error } = useHeroBanner();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  if (!data) return <EmptyState />;

  const { cta, images } = data.fields;
  const imageUrl = images?.[0]?.fields.file?.url
    ? `https:${images[0].fields.file.url}`
    : '';

  return <div>{/* render content */}</div>;
};
```

**Creating New Content Models:**

1. **Create content type in Contentful UI** with desired fields
2. **Define TypeScript skeleton** in `types.ts`:

   ```typescript
   export interface MyContentSkeleton extends EntrySkeletonType {
     contentTypeId: 'myContent';
     fields: {
       title: string;
       body: string;
       image?: Asset;
     };
   }
   export type MyContent = Entry<MyContentSkeleton>;
   ```

3. **Create service function** in `services.ts`:

   ```typescript
   export const getMyContent = async (): Promise<MyContent[]> => {
     const response = await contentfulClient.getEntries<MyContentSkeleton>({
       content_type: 'myContent',
     });
     return response.items;
   };
   ```

4. **Create React Query hook** in `useContentful.ts`:

   ```typescript
   export const useMyContent = () => {
     return useQuery({
       queryKey: ['contentful', 'myContent'],
       queryFn: getMyContent,
       staleTime: 10 * 60 * 1000,
     });
   };
   ```

5. **Export types and hook** in `index.ts`:

   ```typescript
   export type { MyContent, MyContentSkeleton } from './types';
   export { getMyContent } from './services';
   ```

6. **Use in component** as shown in the pattern above

**Important Notes:**

- `Asset` type for media fields (images, files)
- `Entry<T>` for references to other content types
- Always handle `null`/`undefined` for optional fields
- Use `ChainModifiers` generic if needed for advanced querying
- Preview API available via `previewClient` for unpublished content

## Common Patterns & Best Practices

### Error Handling

- Use toast notifications for user feedback
- Implement proper loading states
- Handle network errors gracefully
- Log errors for debugging

### Performance

- Lazy load route components where beneficial
- Optimize images with proper sizing
- Use React.memo for expensive components
- Minimize bundle size with tree shaking

### Accessibility

- Follow WCAG guidelines
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation works

### Mobile Responsiveness

- Mobile-first design approach
- Use `useIsMobile` hook for conditional rendering
- Test on various screen sizes
- Optimize touch interactions

## Code Quality Setup & Configuration

### Installing Development Tools

To set up the complete development environment with code quality tools:

```bash
# Install Prettier for code formatting
bun add -d prettier

# Install Husky for git hooks
bun add -d husky

# Install Commitizen for conventional commits
bun add -d commitizen @commitlint/cli @commitlint/config-conventional cz-conventional-changelog

# Install lint-staged for running commands on staged files
bun add -d lint-staged
```

### Required Configuration Files

1. **Create `.prettierrc` in project root:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

2. **Create `commitlint.config.js` in project root:**

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
};
```

3. **Add to `package.json` scripts section:**

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "commit": "cz",
    "prepare": "husky"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

4. **Initialize Husky after installation:**

```bash
# Initialize husky
bun run prepare

# Add pre-commit hook
echo 'bunx lint-staged' > .husky/pre-commit

# Add commit-msg hook for commitlint
echo 'bunx --no -- commitlint --edit $1' > .husky/commit-msg

# Make hooks executable
chmod +x .husky/*
```

### Usage Instructions

- **For commits:** Always use `bun run commit` instead of `git commit` for guided conventional commits
- **For formatting:** Run `bun run format` to format all files or `bun run format:check` to check formatting
- **Pre-commit:** Hooks automatically run ESLint and Prettier on staged files before each commit
- **Commit messages:** Follow conventional commit format (feat:, fix:, docs:, style:, refactor:, test:, chore:)

## Environment Variables

Required environment variables (see `.env.example`):

**Supabase:**

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

**Stripe:**

- Additional Stripe variables for payment processing

**Contentful CMS:**

- `VITE_CONTENTFUL_SPACE_ID` - Your Contentful Space ID
- `VITE_CONTENTFUL_ACCESS_TOKEN` - Content Delivery API token
- `VITE_CONTENTFUL_PREVIEW_TOKEN` - (Optional) Preview API token for unpublished content
- `VITE_CONTENTFUL_ENVIRONMENT` - (Optional) Environment name (default: 'master')

## Common Issues & Solutions

### Build Issues

- **Dependency conflicts:** Use `bun install --force` to resolve
- **TypeScript errors:** Check `tsconfig.json` path mappings
- **Import errors:** Verify file extensions and case sensitivity

### Development Issues

- **Hot reload not working:** Restart dev server, check file permissions
- **Environment variables not loading:** Restart dev server after .env changes
- **Supabase connection issues:** Verify URL and key in .env
- **Contentful API errors:**
  - Check Space ID and Access Token are correct
  - Verify content type `contentTypeId` matches exactly in Contentful
  - Use `getEntries()` for content type queries, `getEntry()` only for specific IDs
  - Ensure content is published (or use Preview API for drafts)

### Deployment

- Build assets are output to `/dist`
- Static files served from `/public`
- SPA routing requires server configuration for client-side routing

## Testing Strategy

While formal testing is not yet implemented, manual testing should cover:

- Authentication flows (signup, login, logout)
- Space browsing and filtering
- Booking creation and management
- Payment processing
- Real-time messaging
- Multi-language support
- Responsive design across devices

## Development Workflow

1. Create feature branch from main
2. Set up environment variables if needed
3. Install dependencies with `bun install`
4. Start development server with `bun dev`
5. Make changes following coding standards
6. Test functionality manually
7. Run linter with `bun run lint`
8. Build production version to catch issues
9. Commit with descriptive messages
10. Create pull request for review

---

## 🎯 Contentful CMS Quick Reference

### Installation & Setup

```bash
# Install Contentful SDK
bun add contentful

# Environment variables needed
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### File Structure for New Content Models

When creating a new Contentful content model, follow this pattern:

**1. Define Types** (`src/integrations/contentful/types.ts`):

```typescript
export interface MyContentSkeleton extends EntrySkeletonType {
  contentTypeId: 'myContent'; // Must match Contentful content type ID
  fields: {
    title: string; // Required field
    description?: string; // Optional field
    image?: Asset; // Single image/file
    images?: Asset[]; // Multiple images/files
    relatedPost?: Entry<BlogPostSkeleton>; // Reference to another content type
  };
}
export type MyContent = Entry<MyContentSkeleton>;
export type MyContentCollection = EntryCollection<MyContentSkeleton>;
```

**2. Create Service** (`src/integrations/contentful/services.ts`):

```typescript
export const getMyContent = async (): Promise<MyContent[]> => {
  try {
    const response = await contentfulClient.getEntries<MyContentSkeleton>({
      content_type: 'myContent',
      order: ['-sys.createdAt'],
      limit: 10,
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching myContent:', error);
    return [];
  }
};

// For single entry by ID
export const getMyContentById = async (id: string): Promise<MyContent | null> => {
  try {
    const response = await contentfulClient.getEntry<MyContentSkeleton>(id);
    return response;
  } catch (error) {
    console.error('Error fetching myContent by ID:', error);
    return null;
  }
};
```

**3. Create Hook** (`src/hooks/useContentful.ts`):

```typescript
export const useMyContent = () => {
  return useQuery({
    queryKey: ['contentful', 'myContent'],
    queryFn: getMyContent,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useMyContentById = (id: string) => {
  return useQuery({
    queryKey: ['contentful', 'myContent', id],
    queryFn: () => getMyContentById(id),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!id, // Only fetch if ID is provided
  });
};
```

**4. Export** (`src/integrations/contentful/index.ts`):

```typescript
// Types
export type { MyContent, MyContentSkeleton, MyContentCollection } from './types';

// Services
export { getMyContent, getMyContentById } from './services';
```

**5. Use in Component**:

```typescript
import { useMyContent } from '../hooks/useContentful';

const MyComponent = () => {
  const { data, isLoading, error } = useMyContent();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <div>
      {data.map((item) => {
        // Safely extract fields with type casting
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = item.fields as any;
        const title = fields.title as string;
        const image = fields.image as Asset | undefined;
        const imageUrl = image?.fields?.file?.url
          ? `https:${image.fields.file.url}`
          : '';

        return (
          <div key={item.sys.id}>
            <h2>{title}</h2>
            {imageUrl && <img src={imageUrl} alt={title} />}
          </div>
        );
      })}
    </div>
  );
};
```

### Common Contentful Patterns

**Filtering by field value:**

```typescript
const response = await contentfulClient.getEntries<MySkeleton>({
  content_type: 'myContent',
  'fields.category': 'featured', // Filter by field
  order: ['-fields.publishDate'],
});
```

**Include references:**

```typescript
const response = await contentfulClient.getEntries<MySkeleton>({
  content_type: 'myContent',
  include: 2, // Include 2 levels of linked entries
});
```

**Search:**

```typescript
const response = await contentfulClient.getEntries<MySkeleton>({
  content_type: 'myContent',
  query: 'search term', // Full-text search
});
```

**Localization:**

```typescript
const response = await contentfulClient.getEntries<MySkeleton>({
  content_type: 'myContent',
  locale: 'es-MX', // Get Spanish content
});
```

### Field Type Reference

| Contentful Field Type | TypeScript Type          | Example                                                  |
| --------------------- | ------------------------ | -------------------------------------------------------- |
| Short text            | `string`                 | `title: string`                                          |
| Long text             | `string`                 | `description: string`                                    |
| Number                | `number`                 | `price: number`                                          |
| Boolean               | `boolean`                | `featured: boolean`                                      |
| Date                  | `string`                 | `publishDate: string` (ISO 8601)                         |
| Media (single)        | `Asset`                  | `image?: Asset`                                          |
| Media (many)          | `Asset[]`                | `images?: Asset[]`                                       |
| Reference (single)    | `Entry<TypeSkeleton>`    | `author?: Entry<AuthorSkeleton>`                         |
| Reference (many)      | `Entry<TypeSkeleton>[]`  | `tags?: Entry<TagSkeleton>[]`                            |
| JSON Object           | `{ [key: string]: any }` | `metadata?: { [key: string]: any }`                      |
| Rich Text             | `Document`               | `content: Document` (from '@contentful/rich-text-types') |

### Accessing Asset URLs

**Single image:**

```typescript
const image = fields.image as Asset | undefined;
const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '';
const imageTitle = image?.fields?.title || 'Untitled';
const imageWidth = image?.fields?.file?.details?.image?.width;
```

**Multiple images:**

```typescript
const images = fields.images as Asset[] | undefined;
const firstImageUrl = images?.[0]?.fields?.file?.url ? `https:${images[0].fields.file.url}` : '';
```

**Image transformations (Contentful Images API):**

```typescript
const imageUrl = `https:${image.fields.file.url}?w=800&h=600&fit=fill`;
// w = width, h = height, fit = fill|pad|scale|crop|thumb
```

### Error Handling Best Practices

```typescript
// In service function
export const getMyContent = async (): Promise<MyContent[]> => {
  try {
    const response = await contentfulClient.getEntries<MyContentSkeleton>({
      content_type: 'myContent',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching content:', error);
    // Return empty array instead of throwing
    // This allows components to handle gracefully
    return [];
  }
};

// In component
const MyComponent = () => {
  const { data, isLoading, error } = useMyContent();

  // Always handle all states
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  if (!data || data.length === 0) return <EmptyState message="No content available" />;

  return <ContentDisplay data={data} />;
};
```

### Testing Contentful Integration

1. **Test in Contentful Web App first** - Create and publish content
2. **Check environment variables** - Verify Space ID and tokens
3. **Test with curl** - Verify API access:
   ```bash
   curl https://cdn.contentful.com/spaces/SPACE_ID/entries?access_token=TOKEN
   ```
4. **Use browser DevTools** - Check Network tab for Contentful API calls
5. **Check React Query DevTools** - Verify cache and query states

---

## 📝 Recent Changes Log

**IMPORTANT:** Update this section whenever making significant changes to the codebase.

### October 27, 2025 - Documentation Restructuring

**Database Documentation Centralization**

- Created comprehensive `src/docs/DATABASE_DIAGRAMS.md` with:
  - Complete Mermaid UML diagram showing all table relationships
  - Detailed field descriptions for all 10 tables
  - RLS policies, triggers, and indexes documentation
  - Storage buckets and realtime configuration
  - Migration history from 8 migration files
  - Data flow diagrams and security notes
- Analyzed all Supabase migrations (2025-09-26) to ensure accuracy

**Documentation Reorganization**

- Moved all technical documentation to `src/docs/`:
  - `DATABASE_DIAGRAMS.md` (NEW) - Complete database schema
  - `DESIGN_SYSTEM.md` - Brand guidelines and UI patterns
  - `CODE_QUALITY_GUIDE.md` - Development standards
  - `CONTENTFUL_SETUP.md` - CMS setup guide (Spanish)
  - `HEROBANNER_USAGE.md` - Hero Banner usage
- Removed temporary refactoring documentation:
  - Deleted: CHANGELOG_CONTENTFUL.md, COLOR_UPDATE_SUMMARY.md, ESLINT_FIXES.md
  - Deleted: HEADER*REFACTORING_COMPLETE.md, REFACTORING*\*.md files
  - Deleted: RESTRUCTURING_PLAN.md, THEME_UI_MIGRATION_ANALYSIS.md

**README.md Overhaul**

- Complete rewrite with professional structure:
  - Added comprehensive table of contents
  - Detailed project description and features
  - Full technology stack breakdown
  - Quick start guide with Bun/npm instructions
  - Environment variables documentation
  - Architecture section with file structure
  - Database overview with reference to DATABASE_DIAGRAMS.md
  - Deployment options (Lovable, Vercel/Netlify, Docker)
  - Contributing guidelines and code standards
- Improved navigation with clear sections
- Added badges for tech stack
- Updated all documentation links to new `src/docs/` structure

**Copilot Instructions Update**

- Updated directory structure to reflect `src/docs/` folder
- Added "Documentation Organization" section with quick access guide
- Enhanced Supabase Integration section with database details
- Added reference to DATABASE_DIAGRAMS.md for schema questions
- Improved documentation discoverability

### October 18, 2025 - ListSpace Marketing Page

**New Marketing-Focused Host Page (Peerspace-Inspired)**

- Created new `ListSpaceNew.tsx` - Marketing page at `/:lang/host` route
- Separated marketing from form: `/host` (public) vs `/list-space` (protected form)
- Implemented 7 key sections inspired by Peerspace:
  1. Hero with dual CTAs (Get Started + Calculate Earnings)
  2. Statistics/Social proof (3 key metrics)
  3. "Why Host" benefits (3 cards with icons)
  4. "How It Works" (3-step process)
  5. "Space Types" showcase (6 categories)
  6. Trust & Safety features (4 cards)
  7. FAQ section (5 common questions)
  8. Final CTA
- Updated navigation: Header "List Space" → `/host` (marketing page)
- Kept authenticated users' "List Space" → `/list-space` (direct to form)
- Added complete bilingual translations (en/es) for all marketing content
- Used Keysely brand colors: Navy Blue (#1A2B42), Action Blue (#3B82F6)
- Responsive design with mobile-first approach

**Routing Changes:**

- `/:lang/host` - New public marketing page (ListSpaceNew)
- `/:lang/list-space` - Protected route for actual listing form (ListSpace)

### October 16, 2025 - Latest Updates

**Rebranding: Ofikai → Keysely**

- Changed all references from "Ofikai" to "Keysely" across the entire codebase
- Updated: Design system, components, translations, documentation
- Files affected: index.css, Logo.tsx, locales (en/es), Auth.tsx, Footer, Contentful integration, all documentation

**Hero Component Enhancements**

- Implemented full-width hero section using `.full-width-breakout` Tailwind utility
- Added smooth image slider with 1.5s crossfade transitions (6s intervals)
- Fixed height to 85vh for better viewport management
- Integrated transparent-to-solid header on scroll
- Mobile optimizations: hidden subtitle on small screens

**Header Component Improvements**

- Created transparent header that overlays hero image
- Added scroll detection (changes to solid background after 50px)
- Removed HeaderActions component for cleaner, minimal design
- Logo inverts to white when transparent, normal when scrolled
- Navigation links adapt colors based on scroll state
- Reorganized layout: Logo left, Navigation right

**CSS & Layout Fixes**

- Fixed `#root` max-width restriction in App.css (was limiting to 1280px)
- Added `overflow-x: hidden` to html and body to prevent horizontal scroll
- Created custom `.full-width-breakout` utility in tailwind.config.ts
- Updated navbar-sticky and navbar-scrolled classes with backdrop blur

**Contentful Integration**

- Complete CMS setup with 7 content models (Hero Banner, Blog Post, FAQ, etc.)
- Implemented useHeroBanner hook with 10min cache, 2 retries
- Enhanced image slider using Contentful Asset[] arrays
- Proper TypeScript types with EntrySkeletonType patterns

### Key Architectural Decisions Made

1. **Full-Width Hero Pattern**: Using CSS calc() technique for breakout sections
2. **Transparent Header**: Dynamic styling based on scroll position for modern UX
3. **Image Transitions**: Crossfade technique with proper z-index layering to avoid gray flashes
4. **Mobile-First**: Progressive enhancement with hidden elements on small screens
5. **Contentful as Single Source**: Dynamic content managed via CMS instead of hardcoded
6. **Centralized Documentation**: All technical docs in `src/docs/` for easy maintenance

---

**Always trust these instructions first and only explore the codebase if information is incomplete or incorrect.**
