-- Check how many spaces exist
SELECT 
  COUNT(*) as total_spaces,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_spaces,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_spaces
FROM spaces;

-- Show first 3 spaces
SELECT id, title, is_active, city, latitude, longitude 
FROM spaces 
LIMIT 3;
