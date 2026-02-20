-- Migration: Update Gaborone to Windhoek for Namibia-focused application

-- Update city field from Gaborone to Windhoek for all Namibia businesses
UPDATE "Business"
SET city = 'Windhoek', updated_at = NOW()
WHERE city ILIKE 'Gaborone'
  AND country = 'Namibia';

-- Update addresses containing Gaborone to Windhoek
UPDATE "Business"
SET address = REPLACE(address, 'Gaborone', 'Windhoek'), updated_at = NOW()
WHERE address ILIKE '%Gaborone%'
  AND country = 'Namibia';

-- Update default city for new businesses (though handled in code now)
-- This ensures consistency at database level
