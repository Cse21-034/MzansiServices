-- Run this SQL to update all existing businesses with "Gaborone" as city to "Windhoek"
-- This fixes the location data for businesses created before the Namibia localization

BEGIN;

-- Update city field from Gaborone to Windhoek
UPDATE "businesses"
SET city = 'Windhoek'
WHERE city ILIKE 'Gaborone'
  AND country = 'Namibia';

-- Update addresses that contain "Gaborone" to "Windhoek"
UPDATE "businesses"
SET address = REPLACE(address, 'Gaborone', 'Windhoek')
WHERE address ILIKE '%Gaborone%'
  AND country = 'Namibia';

-- Return results to show what was updated
SELECT 
  id,
  name,
  city,
  address,
  updated_at
FROM "businesses"
WHERE city = 'Windhoek'
  AND country = 'Namibia'
ORDER BY updated_at DESC;

COMMIT;
