# Mapbox Branding Guide

This guide explains how to create a custom Mapbox style that matches the Keysely brand identity.

## Brand Colors

Use these colors when customizing your Mapbox style in [Mapbox Studio](https://studio.mapbox.com/):

| Color Name   | Hex Code  | HSL           | Usage                          |
| ------------ | --------- | ------------- | ------------------------------ |
| **Navy**     | `#19283D` | `215 42% 17%` | Water, Parks (Dark Mode), Text |
| **Blue**     | `#3B82F6` | `217 91% 60%` | Roads, Highlights, Icons       |
| **Beige**    | `#C4B3A5` | `27 21% 71%`  | Land, Backgrounds (Light Mode) |
| **Lavender** | `#8B8BDD` | `240 55% 71%` | POIs, Secondary Highlights     |

## Creating a Custom Style

1.  **Log in** to [Mapbox Studio](https://studio.mapbox.com/).
2.  Click **New style**.
3.  Choose a template:
    - **Monochrome** (recommended for easy coloring): Choose "Light" or "Dark" depending on your preference.
    - **Streets**: For a more detailed map.
4.  **Customize Colors**:
    - **Land**: Use **Beige** (`#C4B3A5`) for a warm, branded feel.
    - **Water**: Use **Navy** (`#19283D`) or a lighter tint of it.
    - **Roads**: Keep them neutral (white/gray) or use **Blue** (`#3B82F6`) for major highways.
    - **POIs (Points of Interest)**: Use **Lavender** (`#8B8BDD`) or **Blue** (`#3B82F6`).
5.  **Publish** your style.
6.  **Get the Style URL**:
    - Click the "Share" button.
    - Copy the **Style URL** (e.g., `mapbox://styles/username/styleid`).

## Integrating into the App

Once you have your custom Style URL, update the configuration in `src/utils/mapboxConfig.ts`:

```typescript
// src/utils/mapboxConfig.ts
export const MAPBOX_STYLE = 'mapbox://styles/your-username/your-style-id';
```

## Current Implementation

The application currently uses the standard `mapbox://styles/mapbox/light-v11` style.
The interactive elements (markers, popups) are styled using the **Navy** (`bg-primary`) and **Blue** (`bg-brand-blue`) colors via Tailwind CSS classes in `src/components/map/InteractiveMap.tsx`.
