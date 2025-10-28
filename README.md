# Keysely Platform - Frontend

> 🏢 Marketplace de espacios de trabajo flexible - Descubre, reserva y gestiona oficinas, salas de reuniones y espacios de coworking.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Variables de Entorno](#-variables-de-entorno)
- [Documentación](#-documentación)
- [Arquitectura](#-arquitectura)
- [Despliegue](#-despliegue)

## 🎯 Descripción del Proyecto

Keysely es una plataforma marketplace que conecta usuarios con espacios de trabajo flexibles en Guadalajara, México. La aplicación permite:

- **Usuarios:** Descubrir, reservar y gestionar espacios de trabajo
- **Propietarios:** Listar y administrar sus espacios, recibir pagos vía Stripe
- **Comunicación:** Sistema de mensajería en tiempo real entre usuarios y propietarios

## ✨ Características Principales

- 🔐 **Autenticación completa** con Supabase Auth
- 🏢 **Sistema de reservas** con gestión de disponibilidad
- 💳 **Pagos con Stripe** integrado con Stripe Connect para propietarios
- 💬 **Chat en tiempo real** con Supabase Realtime
- ⭐ **Sistema de reseñas y calificaciones**
- ❤️ **Favoritos y búsqueda avanzada**
- 🌐 **Bilingüe** (Español/Inglés)
- 🌙 **Modo oscuro/claro**
- 📱 **Diseño responsive** (mobile-first)
- 📝 **CMS Contentful** para contenido dinámico

## 🚀 Stack Tecnológico

### Frontend Core

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool con HMR
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI accesibles

### Backend & Servicios

- **Supabase** - Backend as a Service (Auth, PostgreSQL, Storage, Realtime)
- **Contentful** - Headless CMS para contenido dinámico
- **Stripe** - Procesamiento de pagos

### Estado & Data

- **TanStack Query (React Query)** - Data fetching y caching
- **React Context** - Estado global (Auth, Idioma)
- **React Hook Form + Zod** - Manejo de formularios y validación

### Herramientas

- **Bun** - Package manager (preferido)
- **ESLint + Prettier** - Linting y formateo
- **Husky** - Git hooks
- **Commitizen** - Commits convencionales

## 🏃 Inicio Rápido

### Prerrequisitos

- **Node.js 18+** o **Bun** (recomendado)
- Cuenta de **Supabase**
- Cuenta de **Stripe** (para pagos)
- Cuenta de **Contentful** (opcional, para CMS)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/OfiKai/keysely-platform-fe.git
cd keysely-platform-fe

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Instalar dependencias
bun install
# o con npm: npm install

# 4. Iniciar servidor de desarrollo
bun dev
# o con npm: npm run dev
```

El servidor estará disponible en **http://localhost:8080**

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Supabase (Requerido)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Contentful (Opcional - para contenido dinámico)
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token
VITE_CONTENTFUL_ENVIRONMENT=master

# Stripe (Requerido para pagos)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

Ver `.env.example` para la lista completa.

## 📚 Documentación

La documentación técnica se encuentra organizada en [`src/docs/`](./src/docs/):

- **[DATABASE_DIAGRAMS.md](./src/docs/DATABASE_DIAGRAMS.md)** - Esquema completo de base de datos con diagrama UML
- **[DESIGN_SYSTEM.md](./src/docs/DESIGN_SYSTEM.md)** - Sistema de diseño y guía de estilos
- **[CODE_QUALITY_GUIDE.md](./src/docs/CODE_QUALITY_GUIDE.md)** - Estándares de código y mejores prácticas
- **[CONTENTFUL_SETUP.md](./src/docs/CONTENTFUL_SETUP.md)** - Guía de configuración de Contentful CMS
- **[HEROBANNER_USAGE.md](./src/docs/HEROBANNER_USAGE.md)** - Uso del componente Hero Banner

### Documentación Técnica Adicional

- **[Contentful Integration API](./src/integrations/contentful/README.md)** - Detalles de integración con CMS
- **[Copilot Instructions](./.github/copilot-instructions.md)** - Guía completa para GitHub Copilot

## 🏗️ Arquitectura

### Estructura del Proyecto

```text
keysely-platform-fe/
├── src/
│   ├── components/        # Componentes React reutilizables
│   │   ├── ui/           # Componentes base shadcn/ui
│   │   ├── chat/         # Componentes de mensajería
│   │   ├── layout/       # Layout components
│   │   └── ...
│   ├── pages/            # Páginas/rutas de la aplicación
│   ├── contexts/         # React Contexts (Auth, Language)
│   ├── hooks/            # Custom hooks
│   ├── integrations/     # Integraciones externas
│   │   ├── supabase/    # Cliente y tipos de Supabase
│   │   └── contentful/  # Cliente y tipos de Contentful
│   ├── locales/          # Traducciones (en/es)
│   ├── lib/              # Utilidades
│   ├── utils/            # Helpers
│   └── docs/             # 📖 Documentación técnica
├── supabase/             # Configuración y migraciones de BD
├── public/               # Assets estáticos
└── ...
```

### Base de Datos

Ver diagrama completo en [DATABASE_DIAGRAMS.md](./src/docs/DATABASE_DIAGRAMS.md)

**Tablas principales:**

- `profiles` - Perfiles de usuarios
- `spaces` - Espacios de trabajo
- `bookings` - Reservaciones
- `reviews` - Reseñas y calificaciones
- `conversations` + `messages` - Sistema de chat en tiempo real
- `stripe_connect_accounts` - Cuentas de Stripe Connect
- `notifications` - Notificaciones del sistema

### Flujo de Autenticación

1. Usuario se registra vía Supabase Auth
2. Trigger automático crea perfil en tabla `profiles`
3. Usuario puede actuar como Cliente o Propietario
4. RLS (Row Level Security) protege datos por usuario

### Integración de Pagos

- **Stripe Connect** para propietarios (reciben pagos)
- **Stripe Checkout** para clientes (realizan pagos)
- Supabase Edge Functions manejan webhooks

## 📦 Scripts Disponibles

```bash
# Desarrollo
bun dev                 # Servidor de desarrollo (puerto 8080)

# Build
bun run build          # Build de producción
bun run build:dev      # Build de desarrollo
bun run preview        # Preview de build

# Calidad de Código
bun run lint           # Ejecutar ESLint
bun run format         # Formatear con Prettier
bun run format:check   # Verificar formato

# Git
bun run commit         # Commit con Commitizen (convencional)
```

## 🚢 Despliegue

### Opción 1: Lovable (Recomendado para demos)

1. Visitar [Lovable Project](https://lovable.dev/projects/155be6c8-16b2-4da7-9105-75d64276029d)
2. Click en **Share → Publish**
3. Configurar dominio personalizado en **Project > Settings > Domains**

### Opción 2: Vercel/Netlify

```bash
# Build de producción
bun run build

# La carpeta dist/ contiene los archivos estáticos
```

**Configuración importante:**

- Configurar rewrites para SPA routing
- Agregar todas las variables de entorno
- Configurar headers de seguridad

### Opción 3: Docker

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

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit con formato convencional (`bun run commit`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

### Estándares de Código

- **TypeScript strict mode** habilitado
- **ESLint + Prettier** configurados con pre-commit hooks
- **Conventional Commits** requeridos (usar `bun run commit`)
- Ver [CODE_QUALITY_GUIDE.md](./src/docs/CODE_QUALITY_GUIDE.md) para detalles

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Supabase](https://supabase.com/) - Backend as a Service
- [Contentful](https://www.contentful.com/) - Headless CMS
- [Stripe](https://stripe.com/) - Procesamiento de pagos

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0  
**Repositorio:** [OfiKai/keysely-platform-fe](https://github.com/OfiKai/keysely-platform-fe)
