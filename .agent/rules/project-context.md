# Project Context

## Project Overview

Keysely Platform is a **flexible workspace marketplace** built with React 18, TypeScript, and modern web technologies. The application connects users with workspaces (offices, meeting rooms, coworking spaces) in Mexico, featuring real-time chat, payments, and bilingual support (Spanish/English).

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Cloud-based Backend-as-a-Service (Auth, Database, Storage, Realtime)
- **Payments**: Stripe + Stripe Connect
- **State Management**: TanStack Query + React Context
- **CMS**: Contentful (optional)

## Project Structure

```
keysely-platform-frontend/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Application pages/routes
│   ├── contexts/         # React Contexts (Auth, Language)
│   ├── hooks/            # Custom hooks
│   ├── integrations/     # External service integrations
│   ├── locales/          # Translations (en/es)
│   ├── lib/              # Utilities and configurations
│   └── docs/             # Technical documentation
├── public/               # Static assets
└── [config files]        # Build and linting configurations
```

## detailed Workflows

### Development

```bash
# Start development server
bun dev
```

### Build & Deploy

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Code Quality

```bash
# Linting
bun run lint

# Formatting
bun run format
```

## Key Conventions

- **Package Manager**: Bun is the primary package manager.
- **Commits**: Conventional Commits format is required (`bun run commit`).
- **Styling**: Tailwind CSS for all styling.
- **Components**: Functional components with TypeScript interfaces.

## Additional Documentation

- **[AGENTS.md](./AGENTS.md)**: Detailed guide on workflows, code style, and development practices.
