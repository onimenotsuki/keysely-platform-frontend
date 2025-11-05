# Google Maps Setup Guide

This document explains how to set up Google Maps integration for the Keysely Platform.

## Prerequisites

- Google Cloud Platform account
- Billing enabled on your Google Cloud project

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud Console:

1. **Maps JavaScript API** - For displaying maps
2. **Places API** - For geocoding and place search
3. **Geocoding API** - For converting addresses to coordinates

To enable:

- Navigate to "APIs & Services" > "Library"
- Search for each API and click "Enable"

## Step 3: Create a Map ID (OPCIONAL - No requerido actualmente)

**Nota**: Crear un Map ID será necesario cuando la librería `@react-google-maps/api` se actualice para soportar AdvancedMarkerElement. Por ahora, este paso es **opcional**.

Si decides crear el Map ID para el futuro:

1. Go to "Google Maps Platform" > "Map Management" > "Map IDs"
   - Or navigate directly to: https://console.cloud.google.com/google/maps-apis/studio/maps
2. Click "CREATE MAP ID"
3. Configure:
   - **Map name**: `keysely-map` (or any descriptive name)
   - **Map type**: Select "JavaScript"
   - **Description**: "Keysely Platform map with advanced markers"
4. Click "Save"

## Step 4: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. Click "Restrict Key" (recommended for production)

## Step 5: Configure API Key Restrictions

### Application Restrictions

For development:

- Select "HTTP referrers (web sites)"
- Add: `http://localhost:*/*`

For production:

- Add your production domain: `https://yourdomain.com/*`

### API Restrictions

Restrict the key to only the APIs you need:

- Maps JavaScript API
- Places API
- Geocoding API

## Step 6: Add Environment Variable

Add the API key to your `.env` file:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Step 7: Run Database Migration

Apply the migration to add location fields to the spaces table:

```bash
# If using Supabase CLI
supabase db push

# Or run the migration file directly in Supabase SQL editor
```

The migration file is located at:
`supabase/migrations/20251105000001_add_location_fields.sql`

## Features Enabled

### 1. Interactive Map on Search Page

- Split view with map on left, results on right
- Click markers to see space details
- Drag/zoom to search in specific areas
- "Search this area" button appears when map moves

### 2. Location Picker for Hosts

- Automatic geocoding of address
- Drag marker to adjust exact location
- Visual confirmation of property location
- Displays latitude and longitude

### 3. Geo-Based Search

- Filter spaces by map bounds
- Integrate with Algolia for fast geo-search
- Show distance from search center

## Testing

1. **Search Page**:
   - Go to `/explore`
   - Click the "Mapa" button to switch to map view
   - Verify markers appear for all spaces with coordinates
   - Click a marker to see info window
   - Drag the map and click "Search this area"

2. **List Space Page**:
   - Go to `/list-space`
   - Fill in address and city
   - Verify map appears with geocoded location
   - Drag marker to adjust position
   - Submit form and verify coordinates are saved

## Cost Considerations

Google Maps has a free tier with $200 monthly credit, which includes:

- 28,000 map loads per month
- 40,000 geocoding requests per month

For pricing details, see [Google Maps Pricing](https://mapsplatform.google.com/pricing/).

### Cost Optimization Tips

1. **Lazy Load Maps**: Maps only load when needed (already implemented)
2. **Cache Geocoding**: Store coordinates in database (already implemented)
3. **Set Usage Limits**: In Google Cloud Console, set daily quotas
4. **Monitor Usage**: Check Google Cloud Console regularly

## Troubleshooting

### Map not displaying

- Check browser console for errors
- Verify API key is correctly set in `.env`
- Ensure all required APIs are enabled
- Check API key restrictions allow your domain
- **New requirement**: Ensure a Map ID is created and configured (see Step 3)

### Deprecation Warning about google.maps.Marker

If you see this warning in the console:

```
As of February 21st, 2024, google.maps.Marker is deprecated.
Please use google.maps.marker.AdvancedMarkerElement instead.
```

**Estado actual (Noviembre 2024):**

⚠️ Este warning es **inevitable** con la versión actual de `@react-google-maps/api` (v2.20.7). La librería aún no ha migrado completamente a `AdvancedMarkerElement`. Hay un [issue abierto en GitHub](https://github.com/visgl/react-google-maps/issues/614) sobre esto.

**¿Afecta la funcionalidad?** No. Tu aplicación funciona perfectamente. El warning es solo informativo.

**¿Qué hemos hecho?**

1. ✅ Cambiado a `MarkerF` component (mejor práctica actual)
2. ✅ **El warning se suprime automáticamente** en `main.tsx`
3. ✅ Mapas funcionan correctamente sin el mapId (que causaba conflictos)
4. ✅ Código preparado para futura migración a AdvancedMarkerElement

**Solución implementada:**

El warning se suprime automáticamente en `src/main.tsx`:

```typescript
// Suppress Google Maps Marker deprecation warning
// The @react-google-maps/api library still uses the old Marker internally
// This is a temporary measure until the library is updated
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('google.maps.Marker is deprecated')) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};
```

**¿Por qué no usamos mapId?**

- El `mapId` requiere AdvancedMarkerElement nativo de Google
- La librería `@react-google-maps/api` v2.20.7 no lo soporta completamente
- Agregarlo causa que los mapas no se muestren correctamente
- Se agregará cuando la librería se actualice

**Recomendación:** El código actual funciona perfectamente. Los mapas se muestran correctamente y el warning está suprimido.

### Geocoding not working

- Verify Places API is enabled
- Check that address format is correct
- Ensure API key has Geocoding API access

### "This page can't load Google Maps correctly"

- API key is missing or invalid
- Billing is not enabled on Google Cloud project
- Required APIs are not enabled

## Security Best Practices

1. **Restrict API Key**: Always restrict by domain in production
2. **Monitor Usage**: Set up billing alerts
3. **Use Environment Variables**: Never commit API keys to git
4. **Rotate Keys**: Periodically rotate API keys for security

## Fallback Behavior

If Google Maps is not configured:

- Map view button is hidden
- Search defaults to list view only
- Location picker is hidden in ListSpace form
- App continues to work with reduced functionality

This ensures the app works even without Google Maps configured.
