# Ofikai Platform Frontend - GitHub Copilot Instructions

## Project Overview

Ofikai is a workspace marketplace platform that allows users to discover, book, and manage office spaces, meeting rooms, and coworking spaces. The frontend is built with modern React/TypeScript stack featuring a responsive, bilingual (English/Spanish) interface with real-time functionality.

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
│   └── *.tsx            # Feature-specific components
├── contexts/            # React contexts (Auth, Language)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
├── locales/             # Internationalization
├── pages/               # Route components
└── utils/               # Helper utilities

/.github/                # GitHub workflows and templates
/public/                 # Static assets
/supabase/              # Supabase configuration and migrations
```

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
- Prefer type unions over enums for simple values

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
- Row Level Security (RLS) policies implemented
- Real-time subscriptions for messages and notifications
- File upload for space images

### Stripe Integration

- Marketplace payments via Supabase Edge Functions
- Connect accounts for space owners
- Webhook handling for payment status

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

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- Additional Stripe variables for payment processing

## Common Issues & Solutions

### Build Issues

- **Dependency conflicts:** Use `bun install --force` to resolve
- **TypeScript errors:** Check `tsconfig.json` path mappings
- **Import errors:** Verify file extensions and case sensitivity

### Development Issues

- **Hot reload not working:** Restart dev server, check file permissions
- **Environment variables not loading:** Restart dev server after .env changes
- **Supabase connection issues:** Verify URL and key in .env

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

**Always trust these instructions first and only explore the codebase if information is incomplete or incorrect.**
