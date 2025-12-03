# Mapbox Setup Guide

This guide explains how to configure the Mapbox integration used across the Keysely Platform for interactive maps, location picking, and geocoding.

## Prerequisites

- Mapbox account with access to [https://account.mapbox.com](https://account.mapbox.com)
- Billing enabled (Mapbox requires a valid payment method even for the free tier)

## Step 1 · Create an Access Token

1. Sign in to the [Mapbox dashboard](https://account.mapbox.com/).
2. Navigate to **Tokens** → **Create a token**.
3. Select **Default public scopes** (suitable for client-side usage).
4. Optionally set URL restrictions to limit usage to your domains (e.g. `http://localhost:*` and your production domain).
5. Click **Create token** and copy the generated value.

> **Tip:** Give the token a descriptive name such as `Keysely Frontend`.

## Step 2 · Configure Environment Variables

Add the token to your `.env` file (and deployment platform):

```bash
VITE_MAPBOX_ACCESS_TOKEN=pk.your_public_token_here
```

Restart the dev server after changing env variables so Vite can pick up the new value.

## Step 3 · (Optional) Customize the Map Style

The app defaults to the Mapbox **Light** style (`mapbox://styles/mapbox/light-v11`). To use a custom style:

1. Open [Mapbox Studio](https://studio.mapbox.com/).
2. Duplicate an existing style or create a new one that matches the Keysely branding.
3. Publish the style to obtain its style URL (e.g. `mapbox://styles/<username>/<style-id>`).
4. Update `MAPBOX_STYLE` inside `src/utils/mapboxConfig.ts` with your custom URL.

## Step 4 · Verify the Integration

Run the app and confirm that the following flows work:

1. **Explore Map (`/explore`)**
   - Map loads with price markers.
   - Selecting a marker shows the popup with details.
   - Panning or zooming displays the “Search this area” button and updates listings.

2. **List Space (`/list-space`)**
   - Enter an address and confirm the map centers on the location.
   - Drag the marker or click on the map to adjust coordinates.
   - Latitude and longitude fields update automatically.

3. **Owner Wizard (`/list-space/wizard`)**
   - Location step shows the map and marker interactions identical to the main form.

If something fails, review the troubleshooting section below.

## Features Enabled by Mapbox

- Interactive search map with price markers and info popups.
- Host tools for selecting and fine-tuning space coordinates.
- Mapbox geocoding for converting human-readable addresses to latitude/longitude.
- Bounds-based filtering that powers the “Search this area” action.

## Cost & Usage Notes

- Mapbox offers a free tier of **50,000 map loads** and **100,000 geocoding requests** per month (as of 2025).
- Monitor usage from the Mapbox dashboard and consider:
  - Adding domain restrictions to public tokens.
  - Caching geocoding results (already implemented in the backend).
  - Creating additional tokens for staging/production environments.

## Troubleshooting

### Map does not render

- Ensure `VITE_MAPBOX_ACCESS_TOKEN` is defined and exposed during build.
- Check the browser console for Mapbox errors (invalid token, restricted domain, etc.).
- Confirm that `mapbox-gl/dist/mapbox-gl.css` is included (loaded automatically via `MapboxProvider`).

### Geocoding returns no results

- Verify the token has the **Geocoding** scope (included by default for public tokens).
- Confirm the address string is formatted with street, city, and country.
- Mapbox prioritizes proximity to Mexico City; adjust the query if searching in other regions frequently.

### Token was rotated

- Update `.env` (local) and all deployment environments.
- Redeploy the frontend so Vite rebuilds with the new token.

## Useful Links

- [Mapbox Tokens documentation](https://docs.mapbox.com/accounts/guides/tokens/)
- [Mapbox GL JS documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [Pricing & usage details](https://www.mapbox.com/pricing)
- La librería `@react-google-maps/api` v2.20.7 no lo soporta completamente
- Agregarlo causa que los mapas no se muestren correctamente
- Se agregará cuando la librería se actualice

**Recomendación:** El código actual funciona perfectamente. Los mapas se muestran correctamente y el warning está suprimido.

### Geocoding not working

- Confirm the Mapbox token includes access to the Geocoding API (default scope)
- Check the Network tab for 401/403 responses from `api.mapbox.com`
- Ensure queries include enough context (street, city, state, country)
- Wait a few seconds and retry if Mapbox signals temporary rate limiting

## Security Best Practices

1. **Restrict Public Tokens**: Add allowed URL patterns for production domains.
2. **Use Environment Variables**: Never hardcode tokens in source code.
3. **Rotate Regularly**: Generate new tokens from the Mapbox dashboard on a schedule.
4. **Separate Environments**: Use different tokens for local, staging, and production.

## Fallback Behavior

If Mapbox is not configured:

- The search map displays a “Map not available” message.
- Location pickers stay hidden so hosts can still submit forms without coordinates.
- Other Explore page features continue to function using list results.

This ensures the product remains usable while clearly signaling configuration issues.
