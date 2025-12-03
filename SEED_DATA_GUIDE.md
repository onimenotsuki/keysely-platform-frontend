# Seed Data Guide

This guide explains how to use the seeding system to populate your database with test data.

## 📁 Seeding Files

### 1. `src/utils/seedData.ts`

Creates 3 sample spaces for the current user:

- Premium Private Office in Polanco
- Executive Meeting Room in Santa Fe
- Coworking Space in Reforma

**Features:**

- Detailed and realistic data
- Real GPS coordinates from Mexico City
- Configured availability hours
- Complete amenities and features
- Automatically runs on login (with 1 second delay)

### 2. `src/utils/seedSpaces.ts`

Generates up to 55 spaces distributed across 6 Mexican cities:

- Mexico City (20 spaces)
- Monterrey (10 spaces)
- Guadalajara (10 spaces)
- Puebla (5 spaces)
- Querétaro (5 spaces)
- Mérida (5 spaces)

**Features:**

- Dynamic space names by category
- Real GPS coordinates with variation
- Random prices between $15 and $200 per hour
- Random capacity from 2 to 50 people
- Areas from 20 to 300 m²
- Random amenities and features
- Ratings from 3.0 to 5.0
- Dynamic availability hours

### 3. `src/utils/runSeed.ts` (New)

Helper utilities to easily run seeding.

## 🚀 How to Use

### Option 1: Usage from Code

```typescript
import { runFullSeed, runBasicSeed, runBulkSeed } from '@/utils/runSeed';

// Option A: Full seed (initial + multiple spaces)
await runFullSeed({
  clearExisting: false, // Don't delete existing spaces
  generateMultipleSpaces: true, // Generate spaces in multiple cities
});

// Option B: Initial spaces only (3 spaces)
await runBasicSeed();

// Option C: Bulk spaces only (55 spaces)
await runBulkSeed();
```

### Option 2: Usage from Browser Console

Open the browser console (F12) and run:

```javascript
// View available utilities
window.seedUtils;

// Full seed
await window.seedUtils.runFullSeed();

// Basic seed (3 spaces)
await window.seedUtils.runBasicSeed();

// Bulk seed (55 spaces)
await window.seedUtils.runBulkSeed();

// Clear all spaces
await window.seedUtils.clearSpaces();

// View statistics
await window.seedUtils.getSpaceStats();

// View available amenities
window.seedUtils.showAvailableAmenities();
```

### Option 3: From a Component

```typescript
import { useEffect } from 'react';
import { runFullSeed } from '@/utils/runSeed';

function AdminPanel() {
  const handleSeed = async () => {
    const result = await runFullSeed({
      clearExisting: true,  // Clear existing data
      generateMultipleSpaces: true
    });

    if (result.success) {
      console.log('Seeding successful!');
    }
  };

  return (
    <button onClick={handleSeed}>
      Generate Test Data
    </button>
  );
}
```

## 📊 Generated Data

### Space Fields

Each space includes:

```typescript
{
  title: string              // Space name
  description: string        // Detailed description
  address: string           // Full address
  city: string             // City
  latitude: number         // GPS coordinate
  longitude: number        // GPS coordinate
  price_per_hour: number   // Price per hour ($15-$200)
  capacity: number         // Capacity (2-50 people)
  area_sqm: number        // Area in m² (20-300)
  category_id: uuid       // Category ID
  owner_id: uuid          // Owner ID
  images: string[]        // Image URLs
  features: string[]      // Features (4-8)
  amenities: string[]     // Amenities (5-12)
  availability_hours: {   // Availability hours
    monday: { start, end }
    tuesday: { start, end }
    // ... etc
  }
  policies: string        // Space policies
  is_active: boolean     // Active/Inactive
  rating: number        // Rating (3.0-5.0)
  total_reviews: number // Number of reviews (0-50)
}
```

### Available Amenities

```typescript
- WiFi
- Parking
- Air Conditioning
- Kitchen
- Projector
- Whiteboard
- Video Equipment
- Sound System
- 24/7 Access
- Catering
- Cleaning Service
- Reception
- Natural Light
- Outdoor Space
- Disabled Access
```

### Available Features

```typescript
- High-speed Internet
- Ergonomic Furniture
- Break Room
- Equipped Kitchen
- Common Areas
- 24/7 Security
- Cleaning Service
- Receptionist
- Panoramic View
- Natural Light
- Audio System
- Presentation Screen
- Interactive Whiteboard
- Cafeteria Area
- Personal Lockers
- Printer and Scanner
```

## 🗺️ Cities and Coordinates

| City        | Lat     | Lng       | Spaces |
| ----------- | ------- | --------- | ------ |
| Mexico City | 19.4326 | -99.1332  | 20     |
| Monterrey   | 25.6866 | -100.3161 | 10     |
| Guadalajara | 20.6597 | -103.3496 | 10     |
| Puebla      | 19.0414 | -98.2063  | 5      |
| Querétaro   | 20.5888 | -100.3899 | 5      |
| Mérida      | 20.9674 | -89.5926  | 5      |

Each space has a small variation in coordinates (~5km) to distribute them across the city.

## ⚠️ Important Notes

1. **Authentication Required**: You must be authenticated before running the seeding.

2. **Automatic Seed**: The `seedData.ts` file runs automatically on first login.

3. **Duplicates**: The system checks if the user already has spaces before creating initial ones.

4. **Categories**: Make sure categories exist in the database:
   - Private Office
   - Meeting Room
   - Coworking
   - Conference Room
   - Creative Studio

5. **Images**: Spaces use placeholder images. Update URLs to use real images.

6. **Cleanup**: Use `clearSpaces()` with caution, as it will delete ALL spaces from the database.

## 🔄 Update Existing Data

If you need to update coordinates or additional fields in existing spaces:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Update a specific space
await supabase
  .from('spaces')
  .update({
    latitude: 19.4326,
    longitude: -99.1332,
  })
  .eq('id', 'SPACE_ID');

// Update spaces by city
await supabase
  .from('spaces')
  .update({ latitude: 19.4326, longitude: -99.1332 })
  .eq('city', 'Mexico City');
```

## 🧪 Testing

To test the seeding system:

1. Create a test user
2. Run `runFullSeed({ clearExisting: true })`
3. Verify in Supabase that spaces were created
4. Test the search and filters with generated data
5. Verify that GPS coordinates work on the map

## 📝 Customization

To customize the generated data, edit:

- **Names**: Modify `spaceTemplates` in `seedSpaces.ts`
- **Descriptions**: Modify `descriptions` in `seedSpaces.ts`
- **Features**: Modify `features` in `seedSpaces.ts`
- **Amenities**: Modify `AMENITIES_LIST` in `seedSpaces.ts`
- **Cities**: Modify `cities` in `seedSpaces.ts`
- **Price ranges**: Modify `randomInRange(15, 200)` in `seedSpaces.ts`

## 🐛 Troubleshooting

### Error: "No categories found"

**Solution**: Create categories first in Supabase.

### Error: "User not authenticated"

**Solution**: Login before running the seeding.

### Error: "Permission denied"

**Solution**: Verify RLS policies in Supabase.

### Spaces don't appear on the map

**Solution**: Verify that `latitude` and `longitude` fields exist in your table and have valid values.

## 🎯 Next Steps

After generating the data:

1. ✅ Test the search system at `/explore`
2. ✅ Verify filters by city, price, and capacity
3. ✅ Test the interactive map with GPS coordinates
4. ✅ Review that Algolia indexes spaces correctly
5. ✅ Generate test bookings if needed
