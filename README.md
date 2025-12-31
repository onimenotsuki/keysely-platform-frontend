# Keysely Platform - Frontend

> 🏢 Flexible workspace marketplace - Discover, book, and manage offices, meeting rooms, and coworking spaces.

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Documentation](#-documentation)
- [Architecture](#-architecture)
- [Deployment](#-deployment)

## 🎯 Project Description

Keysely is a marketplace platform that connects users with flexible workspaces in Guadalajara, Mexico. The application allows:

- **Users:** Discover, book, and manage workspaces
- **Owners:** List and manage their spaces, receive payments via Stripe
- **Communication:** Real-time messaging system between users and owners

## ✨ Key Features

- 🔐 **Complete authentication** system
- 🏢 **Booking system** with availability management
- 💳 **Stripe payments** integrated with Stripe Connect for owners
- 💬 **Real-time chat** system
- ⭐ **Reviews and ratings system**
- ❤️ **Favorites and advanced search**
- 🌐 **Bilingual** (Spanish/English)
- 🌙 **Dark/Light mode**
- 📱 **Responsive design** (mobile-first)
- 📝 **Contentful CMS** for dynamic content

## 🚀 Technology Stack

### Frontend Core

- **React 18** - UI Library
- **TypeScript** - Static typing
- **Vite** - Build tool with HMR
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components

### Backend & Services

- **Backend Service** - Backend as a Service (Auth, PostgreSQL, Storage, Realtime)
- **Contentful** - Headless CMS for dynamic content
- **Stripe** - Payment processing

### State & Data

- **TanStack Query (React Query)** - Data fetching and caching
- **React Context** - Global state (Auth, Language)
- **React Hook Form + Zod** - Form handling and validation

### Tools

- **Bun** - Package manager (preferred)
- **ESLint + Prettier** - Linting and formatting
- **Husky** - Git hooks
- **Commitizen** - Conventional commits

## 🏃 Quick Start

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- **Backend** service account
- **Stripe** account (for payments)
- **Contentful** account (optional, for CMS)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/OfiKai/keysely-platform-fe.git
cd keysely-platform-fe

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Install dependencies
bun install
# or with npm: npm install

# 4. Start development server
bun dev
# or with npm: npm run dev
```

The server will be available at **http://localhost:8080**

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Backend Services (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Contentful (Optional - for dynamic content)
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token
VITE_CONTENTFUL_ENVIRONMENT=master

# Stripe (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

See `.env.example` for the complete list.

## 📚 Documentation

Technical documentation is organized in [`src/docs/`](./src/docs/):

- **[DATABASE_DIAGRAMS.md](./src/docs/DATABASE_DIAGRAMS.md)** - Complete database schema with UML diagram
- **[DESIGN_SYSTEM.md](./src/docs/DESIGN_SYSTEM.md)** - Design system and style guide
- **[CODE_QUALITY_GUIDE.md](./src/docs/CODE_QUALITY_GUIDE.md)** - Code standards and best practices
- **[CONTENTFUL_SETUP.md](./src/docs/CONTENTFUL_SETUP.md)** - Contentful CMS setup guide
- **[HEROBANNER_USAGE.md](./src/docs/HEROBANNER_USAGE.md)** - Hero Banner component usage

### Additional Technical Documentation

- **[Contentful Integration API](./src/integrations/contentful/README.md)** - CMS integration details
- **[Copilot Instructions](./.github/copilot-instructions.md)** - Complete guide for GitHub Copilot

## 🏗️ Architecture

### Project Structure

```text
keysely-platform-fe/
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── chat/         # Messaging components
│   │   ├── layout/       # Layout components
│   │   └── ...
│   ├── pages/            # Application pages/routes
│   ├── contexts/         # React Contexts (Auth, Language)
│   ├── hooks/            # Custom hooks
│   ├── integrations/     # External integrations
│   │   ├── supabase/    # Backend client and types
│   │   └── contentful/  # Contentful client and types
│   ├── locales/          # Translations (en/es)
│   ├── lib/              # Utilities
│   ├── utils/            # Helpers
│   └── docs/             # 📖 Technical documentation
├── supabase/             # Database configuration and migrations
├── public/               # Static assets
└── ...
```

### Database

See complete diagram in [DATABASE_DIAGRAMS.md](./src/docs/DATABASE_DIAGRAMS.md)

**Main tables:**

- `profiles` - User profiles
- `spaces` - Workspaces
- `bookings` - Reservations
- `reviews` - Reviews and ratings
- `conversations` + `messages` - Real-time chat system
- `stripe_connect_accounts` - Stripe Connect accounts
- `notifications` - System notifications

### Authentication Flow

1. User registers via Auth service
2. Automatic trigger creates profile in `profiles` table
3. User can act as Client or Owner
4. RLS (Row Level Security) protects data per user

### Payment Integration

- **Stripe Connect** for owners (receive payments)
- **Stripe Checkout** for clients (make payments)
- Edge Functions handle webhooks

## 📦 Available Scripts

```bash
# Development
bun dev                 # Development server (port 8080)

# Build
bun run build          # Production build
bun run build:dev      # Development build
bun run preview        # Preview build

# Code Quality
bun run lint           # Run ESLint
bun run format         # Format with Prettier
bun run format:check   # Check format

# Git
bun run commit         # Commit with Commitizen (conventional)
```

## 🚢 Deployment

### Option 1: Lovable (Recommended for demos)

1. Visit [Lovable Project](https://lovable.dev/projects/155be6c8-16b2-4da7-9105-75d64276029d)
2. Click on **Share → Publish**
3. Configure custom domain in **Project > Settings > Domains**

### Option 2: Vercel/Netlify

```bash
# Production build
bun run build

# The dist/ folder contains the static files
```

**Important configuration:**

- Configure rewrites for SPA routing
- Add all environment variables
- Configure security headers

### Option 3: Docker

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit with conventional format (`bun run commit`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript strict mode** enabled
- **ESLint + Prettier** configured with pre-commit hooks
- **Conventional Commits** required (use `bun run commit`)
- See [CODE_QUALITY_GUIDE.md](./src/docs/CODE_QUALITY_GUIDE.md) for details

## 📄 License

This project is private and confidential.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- **Backend Services** - Auth & Database
- [Contentful](https://www.contentful.com/) - Headless CMS
- [Stripe](https://stripe.com/) - Payment processing

---

**Last updated:** October 2025  
**Version:** 1.0.0  
**Repository:** [OfiKai/keysely-platform-fe](https://github.com/OfiKai/keysely-platform-fe)
