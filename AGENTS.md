# AGENTS.md

## Project Overview

Keysely Platform is a **flexible workspace marketplace** built with React 18, TypeScript, and Supabase. The application connects users with workspaces (offices, meeting rooms, coworking spaces) in Mexico, featuring real-time chat, Stripe payments, and bilingual support (Spanish/English).

**Tech Stack:**

- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Supabase (Auth, PostgreSQL, Storage, Realtime)
- Payments: Stripe + Stripe Connect
- CMS: Contentful (optional)
- State: TanStack Query + React Context
- Forms: React Hook Form + Zod

## Setup Commands

### Initial Setup

```bash
# Clone and install dependencies
git clone https://github.com/OfiKai/keysely-platform-fe.git
cd keysely-platform-fe
bun install  # or npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Supabase, Stripe, and Contentful credentials

# Start development server
bun dev  # Runs on http://localhost:8080
```

### Prerequisites

- **Bun** (Required) - All project operations use Bun
- Supabase account with configured project
- Stripe account for payments
- Contentful account (optional, for CMS)

> [!IMPORTANT]
> This project uses **Bun** as the default package manager and runtime for local development (for remote environments, use `npm` or `yarn`). Please do not use `npm` or `yarn`. Always use `bun install`, `bun run`, etc.

### Required Environment Variables

```bash
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Stripe (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Contentful (Optional)
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token
VITE_CONTENTFUL_ENVIRONMENT=master
```

## Development Workflow

### Daily Commands

```bash
# Start dev server
bun dev

# Lint code
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check

# Build for production
bun run build

# Preview production build
bun run preview
```

### Making Changes

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make your changes
3. Stage files: `git add .`
4. Commit with conventional format: `bun run commit` (NOT `git commit`)
5. Push to branch: `git push origin feat/feature-name`
6. Open Pull Request

### Pre-commit Hooks

The project has automatic hooks that run before each commit:

- **ESLint** runs on all `.js`, `.jsx`, `.ts`, `.tsx` files (with auto-fix)
- **Prettier** formats all code files
- **Commitlint** validates commit messages

If linting fails, the commit is blocked. Fix errors before committing.

## Code Style

### TypeScript Rules

- **TypeScript strict mode** enabled
- Always use explicit types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use `const` by default, `let` only when reassignment is needed
- Never use `any` - use `unknown` or proper types

### React Patterns

- **Functional components** only (no class components)
- Use **custom hooks** for reusable logic
- Keep components small and focused (< 200 lines)
- Props should be typed with interfaces
- Use **React Query** for data fetching, not `useEffect`
- Use **Context** sparingly (auth, language, theme only)

### Internationalization (i18n)

- **Always update translations** when adding new text to the UI
- Translation files are located in `src/locales/` (en.json, es.json)
- Use the `useTranslation` hook to access translations
- Never hardcode user-facing text directly in components
- Add translation keys in both English and Spanish simultaneously
- Follow the existing key structure and naming conventions

### Naming Conventions

- Components: `PascalCase` (e.g., `SpaceCard.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useSpaces.ts`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: `kebab-case` (handled by Tailwind)

### Formatting

- **Prettier** configured with project defaults
- Single quotes for strings
- No semicolons
- 2-space indentation
- Trailing commas in multiline
- 80-character line length (soft limit)

### Design System Rules

- **Never use CSS gradients** - Use solid colors from the Tailwind theme only
- Use `bg-primary` (Navy) and `hover:bg-brand-blue` (Blue) for primary buttons
- **Brand Colors**:
  - **Navy**: `hsl(215 42% 17%)` (Primary)
  - **Blue**: `hsl(217 91% 60%)` (Accent/Highlight)
  - **Beige**: `hsl(27 21% 71%)` (Secondary)
  - **Lavender**: `hsl(240 55% 71%)` (Decorative)
- Use theme colors defined in `tailwind.config.ts`
- Avoid inline color values when possible, prefer theme variables
- Keep designs clean and modern with flat colors

### File Organization

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui base components (DO NOT modify)
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   └── [feature]/       # Other feature components
├── pages/               # Route pages (one per route)
├── hooks/               # Custom React hooks
├── contexts/            # React Context providers
├── lib/                 # Third-party library configurations
├── utils/               # Helper functions and utilities
├── integrations/        # External service integrations
│   ├── supabase/       # Supabase client and types
│   └── contentful/     # Contentful CMS integration
├── locales/            # Translation files (en.json, es.json)
└── docs/               # Technical documentation
```

### Import Order

1. React imports
2. Third-party libraries
3. Absolute imports from `@/`
4. Relative imports
5. Type imports (grouped at the end)

```typescript
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/utils/date';
import type { Space } from '@/integrations/supabase/types';
```

## Architecture

### Component Patterns

**Prefer composition over props drilling:**

```typescript
// Good: Compound component pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Bad: Too many props
<Card title="Title" content="Content" showHeader={true} />
```

**Use custom hooks for business logic:**

```typescript
// hooks/useBookings.ts
export function useBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => fetchBookings(userId),
  });
}

// Component stays clean
function BookingList() {
  const { data: bookings, isLoading } = useBookings(userId);
  // ...
}
```

### State Management

- **Server state**: TanStack Query (React Query)
- **Global client state**: React Context (auth, language, theme)
- **Local component state**: `useState` / `useReducer`
- **Form state**: React Hook Form + Zod

**Never mix concerns** - don't put server data in Context.

### Database Access

All database operations go through Supabase:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Queries use React Query
const { data } = useQuery({
  queryKey: ['spaces'],
  queryFn: async () => {
    const { data, error } = await supabase.from('spaces').select('*').eq('is_active', true);

    if (error) throw error;
    return data;
  },
});

// Mutations use React Query mutations
const mutation = useMutation({
  mutationFn: async (spaceData) => {
    const { data, error } = await supabase.from('spaces').insert(spaceData);

    if (error) throw error;
    return data;
  },
});
```

### Row Level Security (RLS)

Supabase tables use RLS policies:

- Users can only read active spaces
- Users can only update their own profile
- Owners can only manage their own spaces
- Bookings require authentication

**Never bypass RLS** - all queries respect security policies.

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Automatic database trigger creates profile in `profiles` table
3. `AuthProvider` context stores current user
4. Protected routes check auth status
5. RLS policies enforce data access

```typescript
// Check authentication in components
const { user } = useAuth()
if (!user) return <Navigate to="/login" />
```

## Testing Instructions

### Manual Testing

Before committing any changes:

1. **Linting**: `bun run lint` - Fix all errors
2. **Formatting**: `bun run format:check` - Ensure proper formatting
3. **Build**: `bun run build` - Verify production build succeeds
4. **Type checking**: Check for TypeScript errors in IDE

### Feature Testing Checklist

When implementing features:

- [ ] Test in both **light and dark mode**
- [ ] Test in both **English and Spanish** (language toggle)
- [ ] Test on **mobile viewport** (responsive design)
- [ ] Test with **authenticated and unauthenticated** users
- [ ] Verify **error handling** (network errors, validation errors)
- [ ] Check **loading states** (skeletons, spinners)
- [ ] Test **edge cases** (empty states, max values, special characters)

### Database Testing

Use seed data utilities:

```javascript
// In browser console (F12)
await window.seedUtils.runFullSeed(); // Generate 55+ spaces
await window.seedUtils.runBasicSeed(); // Generate 3 spaces
await window.seedUtils.clearSpaces(); // Clear all spaces
await window.seedUtils.getSpaceStats(); // View statistics
```

See `SEED_DATA_GUIDE.md` for full details.

### Integration Testing

Test critical flows end-to-end:

1. **Booking flow**: Search → Space details → Booking form → Payment → Confirmation
2. **Owner flow**: Login → Create space → Upload images → Publish → Manage bookings
3. **Chat flow**: View booking → Send message → Receive reply (test with two users)
4. **Payment flow**: Stripe Connect setup → Receive payment → Payout

## Commit Guidelines

### Conventional Commits

**Always use** `bun run commit` (not `git commit`).

Commit types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Maintenance, dependencies, config changes

**Examples:**

```bash
feat: add favorites system for spaces
fix: resolve payment processing error on checkout
docs: update API integration guide
style: format code with prettier
refactor: extract booking logic into custom hook
perf: optimize space search query with indexes
test: add unit tests for date utilities
chore: update dependencies to latest versions
```

### Breaking Changes

For breaking changes, add `!` after type:

```bash
feat!: change booking API to use ISO dates

BREAKING CHANGE: Booking dates now use ISO 8601 format instead of Unix timestamps
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**: One of the types above
- **scope**: Optional, e.g., `(auth)`, `(booking)`, `(payment)`
- **subject**: Short description, lowercase, no period at end
- **body**: Optional, detailed explanation
- **footer**: Optional, breaking changes, issue references

## Pull Request Guidelines

### PR Title Format

```
[<type>] <description>
```

Examples:

- `[feat] Add user favorites system`
- `[fix] Resolve payment error on checkout`
- `[docs] Update setup instructions`

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Ran linting and formatting
- [ ] Tested on mobile
- [ ] Tested in both languages
- [ ] Tested in dark mode
- [ ] Manual testing performed

## Screenshots

(if applicable)

## Related Issues

Closes #123
```

### PR Review Checklist

Before requesting review:

- [ ] All commits follow conventional format
- [ ] Code passes linting: `bun run lint`
- [ ] Code is formatted: `bun run format`
- [ ] Build succeeds: `bun run build`
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Tested thoroughly (see testing checklist)
- [ ] Documentation updated if needed

## Security Guidelines

### Environment Variables

- **Never commit** `.env` files
- **Never hardcode** API keys or secrets
- Always use `VITE_*` prefix for client-side variables
- Server secrets go in Supabase Edge Functions, not client code

### Supabase Security

- **Always use RLS policies** - never disable Row Level Security
- **Validate user input** on both client and server
- **Use parameterized queries** (Supabase does this by default)
- **Verify ownership** before updates/deletes

### Authentication

- Use Supabase Auth - never roll your own
- Check `user` object before protected operations
- Redirect unauthenticated users to login
- Handle token refresh automatically (Supabase handles this)

### Data Validation

Always validate with Zod:

```typescript
import { z } from 'zod';

const spaceSchema = z.object({
  title: z.string().min(3).max(100),
  price_per_hour: z.number().positive(),
  capacity: z.number().int().positive(),
});

// In forms
const form = useForm({
  resolver: zodResolver(spaceSchema),
});
```

### Payments

- **Never handle card details directly** - use Stripe Elements
- Verify payments server-side via webhooks
- Handle failed payments gracefully
- Log payment errors for debugging

## Deployment

### Build for Production

```bash
# Create production build
bun run build

# Test production build locally
bun run preview
```

The `dist/` folder contains static files ready for deployment.

### Deployment Options

**Option 1: Lovable (Recommended)**

- Visit project dashboard
- Click "Share → Publish"
- Configure custom domain in settings

**Option 2: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 3: Netlify**

- Connect GitHub repository
- Build command: `bun run build`
- Publish directory: `dist`
- Add environment variables

### Environment Variables

Set these in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_CONTENTFUL_SPACE_ID` (optional)
- `VITE_CONTENTFUL_ACCESS_TOKEN` (optional)
- `VITE_CONTENTFUL_PREVIEW_TOKEN` (optional)
- `VITE_CONTENTFUL_ENVIRONMENT` (optional)

### Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test authentication flow
- [ ] Test payment flow (use Stripe test mode)
- [ ] Verify all pages load correctly
- [ ] Check console for errors
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Set up error monitoring (optional)

## Database Management

### Migrations

Migrations are in `supabase/migrations/`:

```bash
# Create new migration
npx supabase migration new migration_name

# Apply migrations
npx supabase db push

# Reset database (development only)
npx supabase db reset
```

### Schema Changes

When changing database schema:

1. Create migration file
2. Test locally with `supabase db push`
3. Update TypeScript types (auto-generated by Supabase CLI)
4. Update related queries/components
5. Test thoroughly before production

### Seed Data

The project has automated seeding:

- `src/utils/seedData.ts` - Creates 3 initial spaces
- `src/utils/seedSpaces.ts` - Generates 55+ spaces across Mexico
- `src/utils/runSeed.ts` - Helper utilities

See `SEED_DATA_GUIDE.md` for complete documentation.

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb dist
bun install
bun run build
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit
```

### Supabase Connection Issues

- Verify `.env` variables are correct
- Check Supabase project is active
- Ensure RLS policies allow operation
- Check network tab for error details

### Pre-commit Hooks Not Running

```bash
# Reinstall Husky
bun run prepare
chmod +x .husky/*
```

### Formatting Conflicts

```bash
# Reformat everything
bun run format
git add .
git commit
```

## Additional Documentation

Detailed documentation is available in `src/docs/`:

- **DATABASE_DIAGRAMS.md** - Complete database schema
- **DESIGN_SYSTEM.md** - UI/UX guidelines
- **CODE_QUALITY_GUIDE.md** - Code standards
- **CONTENTFUL_SETUP.md** - CMS setup guide
- **HEROBANNER_USAGE.md** - Hero banner component usage

Also see:

- **SEED_DATA_GUIDE.md** - Seed data system documentation
- **README.md** - Project overview and quick start
- **.github/copilot-instructions.md** - AI pair programming guide

## Project Structure

```
keysely-platform-fe/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components (DO NOT modify)
│   │   ├── features/     # Feature components
│   │   ├── layout/       # Layout components
│   │   └── chat/         # Chat system
│   ├── pages/            # Route pages
│   ├── hooks/            # Custom hooks
│   ├── contexts/         # React contexts (Auth, Language, Theme)
│   ├── integrations/     # External integrations
│   │   ├── supabase/    # Database client
│   │   └── contentful/  # CMS client
│   ├── locales/          # Translations (en.json, es.json)
│   ├── lib/              # Library configs
│   ├── utils/            # Helper functions
│   └── docs/             # Technical documentation
├── supabase/             # Database migrations
├── public/               # Static assets
├── .husky/               # Git hooks
└── [config files]        # ESLint, Prettier, TypeScript, etc.
```

## Key Features Implementation

### Authentication

- Supabase Auth with email/password
- Automatic profile creation via database trigger
- Protected routes with `AuthProvider`
- Session persistence

### Booking System

- Space search with filters
- Calendar-based availability
- Real-time booking creation
- Booking management dashboard

### Payments

- Stripe Connect for space owners
- Stripe Checkout for customers
- Webhook handling via Supabase Edge Functions
- Payment status tracking

### Real-time Chat

- Supabase Realtime subscriptions
- Conversation threads per booking
- Message persistence
- Unread message indicators

### Internationalization

- Spanish (default) and English
- Context-based language switching
- Translations in `src/locales/`
- Date/time formatting per locale

### Theme System

- Light/Dark mode support
- System preference detection
- Persistent theme selection
- Theme-aware components

## Performance Best Practices

- Use **React Query** for data caching
- Implement **lazy loading** for images and routes
- Use **memoization** (`useMemo`, `memo`) for expensive computations
- Optimize bundle size with **dynamic imports**
- Use **Tailwind JIT** for minimal CSS
- Implement **virtual scrolling** for long lists
- Cache static assets with appropriate headers

## Accessibility

- Use semantic HTML
- Provide `alt` text for images
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios (WCAG AA)
- Use ARIA attributes when needed
- Test with accessibility tools

---

**Last Updated:** November 2024  
**Version:** 1.0.0  
**Maintainer:** Keysely Development Team
