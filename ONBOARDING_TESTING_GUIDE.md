# Onboarding Testing Guide

This guide will help you test the complete user onboarding flow that has been implemented.

## What Was Implemented

### 1. Database Changes

- **Migration file**: `supabase/migrations/20251107000000_add_onboarding_fields.sql`
- Added new fields to `profiles` table:
  - `occupation` (text)
  - `date_of_birth` (date)
  - `address` (jsonb) - Stores address in JSON format with: streetAddress, city, state, postalCode, country
  - `onboarding_completed` (boolean, default: false)
  - `onboarding_completed_at` (timestamp)

### 2. Core Components

- **Hook**: `src/hooks/useOnboardingProgress.ts` - Manages localStorage, validation, and progress tracking
- **Main Page**: `src/pages/Onboarding.tsx` - 4-step wizard with full-screen layout
- **Progress Indicator**: `src/components/onboarding/ProgressIndicator.tsx` - Visual stepper
- **Step Components** (in `src/components/onboarding/`):
  - `StepOccupation.tsx` - Required
  - `StepBirthday.tsx` - Required (must be 18+)
  - `StepAddress.tsx` - Optional (JSON format with multiple fields)
  - `StepBio.tsx` - Optional

### 3. Integration

- **Auth Page** (`src/pages/Auth.tsx`): Updated to redirect to `/onboarding` after successful signup
- **Protected Route** (`src/components/ProtectedRoute.tsx`): Now checks onboarding completion status
- **Routing** (`src/App.tsx`): Added `/onboarding` route
- **Translations**: Added to both `es.json` and `en.json`

## Testing Instructions

### Prerequisites

1. Apply the database migration:

   ```bash
   # If using Supabase CLI locally
   npx supabase db push

   # Or apply manually via Supabase Dashboard > SQL Editor
   ```

2. Start the development server:
   ```bash
   bun dev
   ```

### Test Flow 1: Complete Onboarding (Happy Path)

1. **Sign up a new user**:
   - Navigate to `/auth`
   - Click on "Registrarse" tab
   - Fill in:
     - Nombre completo: "Test User"
     - Email: "testuser@example.com"
     - Contraseña: "password123"
   - Click "Registrarse"

2. **Should redirect to `/onboarding` automatically**

3. **Step 1 - Occupation**:
   - Enter: "Software Developer"
   - Click "Continuar"

4. **Step 2 - Birthday**:
   - Select a date (must be 18+ years old)
   - Click "Continuar"

5. **Step 3 - Address** (Optional):
   - Enter address fields:
     - Dirección: "Calle Principal 123"
     - Ciudad: "Guadalajara"
     - Estado: "Jalisco"
     - Código postal: "44500"
     - País: "México"
   - Or click "Omitir" to skip

6. **Step 4 - Bio** (Optional):
   - Enter some text or leave blank
   - Click "Completar" or "Omitir"

7. **Verify completion**:
   - Should redirect to home page (`/es`)
   - User should now have access to all protected routes
   - Check localStorage: `onboarding_started` should be removed

### Test Flow 2: Browser Close & Resume

1. **Start signup and onboarding**:
   - Sign up with a new email
   - Get redirected to onboarding
   - Complete Step 1 only

2. **Check localStorage**:
   - Open DevTools > Application > Local Storage
   - You should see `keysely_onboarding_progress` with:
     - `currentStep: 2`
     - Filled data for occupation

3. **Close the browser tab** (or refresh the page)

4. **Reopen the app and navigate to `/onboarding`**:
   - Should resume at Step 2 (Birthday)
   - Previous data should be preserved
   - Complete the remaining steps

5. **Verify**:
   - Data persists across browser sessions
   - Can complete onboarding from where you left off

### Test Flow 3: Validation

1. **Test occupation validation**:
   - Try to proceed from Step 1 without entering occupation
   - Should show error: "La ocupación es requerida"
   - Try occupation with less than 2 characters
   - Should show error: "La ocupación debe tener al menos 2 caracteres"

2. **Test birthday validation**:
   - Try selecting a future date - should be blocked
   - Try selecting a date less than 18 years ago
   - Should show error: "Debes tener al menos 18 años"

3. **Test optional fields**:
   - Steps 3 and 4 should allow skipping
   - "Omitir" button should be visible
   - Should be able to proceed without filling these fields

4. **Test address fields**:
   - All address fields are optional
   - Can leave any field blank
   - Can skip entire address step

### Test Flow 4: Protected Routes & Onboarding Check

1. **Sign up but don't complete onboarding**:
   - Create a new account
   - On Step 1 of onboarding, manually navigate to `/es/profile`

2. **Should redirect back to `/onboarding`**

3. **Try accessing other protected routes**:
   - `/es/bookings` → redirects to `/onboarding`
   - `/es/messages` → redirects to `/onboarding`
   - `/es/favorites` → redirects to `/onboarding`

4. **Complete onboarding**:
   - Go back to `/onboarding`
   - Complete all steps
   - Click "Completar"

5. **Access protected routes again**:
   - Should now have access to all protected routes
   - No more redirects to onboarding

### Test Flow 5: Existing Users (Backward Compatibility)

1. **Check existing user behavior**:
   - If you have existing users in the database
   - Their `onboarding_completed` should be `false` by default
   - When they log in, they'll be redirected to onboarding
   - This is expected behavior

2. **Skip onboarding for existing users** (if needed):
   - Run this SQL in Supabase:
   ```sql
   UPDATE profiles
   SET onboarding_completed = true,
       onboarding_completed_at = NOW()
   WHERE created_at < '2025-11-07';
   ```

### Test Flow 6: Sign In (Existing Users)

1. **Log in with an existing user who completed onboarding**:
   - Navigate to `/auth`
   - Sign in
   - Should go directly to home page, NOT to onboarding

2. **Log in with a user who hasn't completed onboarding**:
   - Should be redirected to `/onboarding`
   - Must complete onboarding before accessing the platform

## Visual Design Verification

Verify that the onboarding UI matches the brand:

- ✅ Full-screen layout (similar to Airbnb onboarding)
- ✅ White background with clean design
- ✅ Keysely logo in header
- ✅ Progress indicator at bottom
- ✅ Primary button: Blue (`bg-primary` → `#3B82F6` on hover)
- ✅ Input fields with consistent styling
- ✅ Responsive design (mobile-friendly)
- ✅ Step counter in top-right corner
- ✅ Back button with underline styling

## Database Verification

After completing onboarding, verify the data in Supabase:

```sql
SELECT
  user_id,
  full_name,
  occupation,
  date_of_birth,
  address,
  bio,
  onboarding_completed,
  onboarding_completed_at
FROM profiles
WHERE user_id = 'YOUR_USER_ID';
```

Expected results:

- `full_name`: Filled from signup form
- `occupation`: Filled
- `date_of_birth`: Filled (valid date, 18+ years old)
- `address`: JSONB object with fields or NULL
  ```json
  {
    "streetAddress": "Calle Principal 123",
    "city": "Guadalajara",
    "state": "Jalisco",
    "postalCode": "44500",
    "country": "México"
  }
  ```
- `bio`: Filled or NULL
- `onboarding_completed`: `true`
- `onboarding_completed_at`: Timestamp

## Troubleshooting

### Issue: "Profile not found" error

- **Solution**: Make sure the database migration has been applied

### Issue: Onboarding doesn't redirect after completion

- **Solution**: Check browser console for errors. Verify Supabase connection.

### Issue: localStorage not persisting

- **Solution**: Check if localStorage is enabled in browser. Try incognito mode to test.

### Issue: Can't skip optional steps

- **Solution**: Only steps 4 and 5 are skippable. Steps 1-3 are required.

### Issue: Validation not working

- **Solution**: Check browser console for errors. Verify translation keys are loaded.

## Additional Notes

- **localStorage Key**: `keysely_onboarding_progress`
- **Completion Flag**: `onboarding_started` (removed after completion)
- **Progress Saved**: After every step navigation
- **Translations**: Available in both Spanish (default) and English
- **Mobile Support**: Fully responsive design

## Next Steps

After testing, you may want to:

1. **Customize validation rules** in `useOnboardingProgress.ts`
2. **Add more fields** by updating the migration and components
3. **Customize styling** to match specific brand requirements
4. **Add analytics tracking** for onboarding completion rates
5. **Set up email reminders** for users who abandon onboarding

## Support

If you encounter any issues during testing, check:

1. Browser console for JavaScript errors
2. Network tab for API call failures
3. Supabase logs for database errors
4. localStorage contents for state debugging
