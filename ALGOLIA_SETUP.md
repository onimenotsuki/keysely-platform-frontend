# Algolia Search Setup Guide

This document explains how to set up Algolia search for the Keysely Platform.

## Prerequisites

- Algolia account (sign up at [algolia.com](https://www.algolia.com/))
- Supabase project with admin access

## Step 1: Create Algolia Index

1. Log in to your Algolia dashboard
2. Create a new application or use an existing one
3. Create a new index called `spaces`
4. Configure searchable attributes:
   - `title` (ordered)
   - `description` (ordered)
   - `city` (ordered)
   - `amenities` (unordered)
   - `features` (unordered)

## Step 2: Configure Environment Variables

Add the following to your `.env` file:

```
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_SEARCH_API_KEY=your_search_api_key
```

For the Supabase Edge Function, add these secrets to your Supabase project:

```bash
supabase secrets set ALGOLIA_APP_ID=your_app_id
supabase secrets set ALGOLIA_ADMIN_API_KEY=your_admin_api_key
```

## Step 3: Deploy Supabase Edge Function

Deploy the sync function to automatically index spaces in Algolia:

```bash
supabase functions deploy sync-spaces-to-algolia
```

## Step 4: Set Up Database Trigger

Run this SQL in your Supabase SQL editor to automatically sync spaces:

```sql
-- Create trigger to sync spaces to Algolia
CREATE OR REPLACE FUNCTION trigger_sync_space_to_algolia()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function
  PERFORM
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/sync-spaces-to-algolia',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'record', to_jsonb(NEW),
        'old_record', to_jsonb(OLD)
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
CREATE TRIGGER on_space_change
  AFTER INSERT OR UPDATE ON public.spaces
  FOR EACH ROW
  EXECUTE FUNCTION trigger_sync_space_to_algolia();

-- Create trigger for DELETE
CREATE TRIGGER on_space_delete
  AFTER DELETE ON public.spaces
  FOR EACH ROW
  EXECUTE FUNCTION trigger_sync_space_to_algolia();
```

## Step 5: Initial Data Sync

To sync existing spaces to Algolia, you have three options:

### Option A: Use Browser Console (Easiest - Recommended)

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Open your app in the browser** (usually `http://localhost:5173`)

3. **Open the browser console** (Press F12 or right-click → Inspect → Console)

4. **Run the sync command:**

   ```javascript
   await window.syncToAlgolia();
   ```

   This will automatically:
   - Fetch all active spaces from Supabase
   - Transform them to Algolia format
   - Upload them to your Algolia index
   - Show progress in the console

### Option B: Use the seed script (for new projects)

```typescript
import { generateSeedSpaces } from './src/utils/seedSpaces';
import { useAuth } from './src/contexts/AuthContext';

// In your application, after authentication
const { user } = useAuth();
if (user) {
  await generateSeedSpaces(user.id);
}
```

### Option C: Import and use the sync utility directly

```typescript
import { syncExistingSpacesToAlgolia } from './src/utils/syncToAlgolia';

// Call this function wherever needed
await syncExistingSpacesToAlgolia();
```

### Additional Console Commands

The following commands are also available in the browser console:

```javascript
// Clear the entire Algolia index (with confirmation)
await window.clearAlgoliaIndex();

// Clear and re-sync all spaces (with confirmation)
await window.reindexAllSpaces();
```

## Step 6: Configure Algolia Index Settings

In your Algolia dashboard, configure these settings for optimal search:

### Searchable Attributes

```json
["title", "description", "city", "amenities", "features"]
```

### Custom Ranking

```json
["desc(rating)", "desc(total_reviews)"]
```

### Facets

```json
["category_id", "city", "amenities", "is_active"]
```

### Geo Search

Enable geo search in the settings to use map-based filtering.

## How It Works

1. **Frontend Search**: The app uses `useAlgoliaSearch` hook to search spaces
2. **Smart Routing**:
   - Uses Algolia for: text search, amenities filters, geo-search
   - Uses Supabase for: simple category/city filters
3. **Auto-Sync**: Database triggers automatically sync changes to Algolia
4. **Fallback**: If Algolia is unavailable, falls back to Supabase search

## Testing

1. Create a new space in your app
2. Check Algolia dashboard to verify it appears in the index
3. Search for the space using the search box
4. Try filtering by amenities
5. Use the map to search by geographic bounds

## Troubleshooting

### Spaces not appearing in search results

- Check Algolia dashboard to verify records are indexed
- Verify environment variables are set correctly
- Check browser console for errors

### Geo-search not working

- Ensure spaces have latitude and longitude values
- Verify `_geoloc` field is present in Algolia records
- Check that geo-search is enabled in Algolia index settings

### Edge function failing

- Check Supabase function logs: `supabase functions logs sync-spaces-to-algolia`
- Verify secrets are set: `supabase secrets list`
- Test the function manually with a sample payload

## Cost Considerations

Algolia has a free tier with:

- 10,000 records
- 10,000 requests per month

For production use, review [Algolia pricing](https://www.algolia.com/pricing/) and set up cost alerts in your dashboard.
