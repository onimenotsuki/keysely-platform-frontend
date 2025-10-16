# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/155be6c8-16b2-4da7-9105-75d64276029d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/155be6c8-16b2-4da7-9105-75d64276029d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

Before run the development server

1. Obtain the required environment variables and create a `.env` file in the root directory of the project.
2. Refer to the `.env.example` file to ensure all variables are correctly specified.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- **Contentful CMS** - Headless CMS for managing dynamic content
- Supabase - Backend as a Service (Auth, Database, Storage)
- TanStack Query - Data fetching and caching
- Stripe - Payment processing

## 🎨 Contentful CMS Integration

This project integrates **Contentful CMS** for managing dynamic content like hero banners, blog posts, and marketing materials.

### Quick Start with Contentful

1. **Create a Contentful account** at [contentful.com](https://www.contentful.com/)

2. **Get your API credentials:**
   - Go to Settings → API keys
   - Copy your Space ID and Content Delivery API access token

3. **Add to `.env` file:**

   ```bash
   VITE_CONTENTFUL_SPACE_ID=your_space_id_here
   VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
   ```

4. **Create a Hero Banner** (optional):
   - See [HEROBANNER_USAGE.md](./HEROBANNER_USAGE.md) for detailed instructions
   - Or follow [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md) for complete setup guide

### Available Contentful Features

- ✅ **Hero Banner** - Dynamic hero section with images and CTA
- ✅ **Blog Posts** - Content type ready for blog integration
- ✅ **FAQs** - Frequently asked questions management
- ✅ **Marketing Banners** - Promotional content management

### Documentation

- **[CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md)** - Complete setup guide (in Spanish)
- **[HEROBANNER_USAGE.md](./HEROBANNER_USAGE.md)** - Hero Banner component usage
- **[Technical Docs](./src/integrations/contentful/README.md)** - API integration details

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/155be6c8-16b2-4da7-9105-75d64276029d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
