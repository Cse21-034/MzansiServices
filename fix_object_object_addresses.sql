-- Fix: Remove [object Object] from address field completely
-- This cleans corrupted address data that contains serialized JavaScript objects

-- First, let's see how many businesses have this issue
SELECT COUNT(*) as corrupted_count, 
       COUNT(CASE WHEN address LIKE '%[object Object]%' THEN 1 END) as corrupted_with_object
FROM "businesses"
WHERE address LIKE '%[object Object]%';

-- Now fix by extracting just the first part (street address) before [object Object]
UPDATE "businesses"
SET address = TRIM(
    CASE 
        -- If address contains [object Object], extract the first part before it
        WHEN address LIKE '%[object Object]%' THEN 
            TRIM(SUBSTRING(address FROM 1 FOR POSITION('[object Object]' IN address) - 1))
        ELSE address
    END
),
    updated_at = NOW()
WHERE address LIKE '%[object Object]%';

-- Verify the cleanup
SELECT id, name, city, address, updated_at
FROM "businesses"
WHERE address LIKE '%[object Object]%'
   OR address IS NULL 
   OR address = ''
ORDER BY updated_at DESC;

-- Also ensure all addresses have proper city and country combination
UPDATE "businesses"
SET address = CONCAT_WS(', ', 
    NULLIF(TRIM(address), ''),
    NULLIF(TRIM(city), ''),
    NULLIF(TRIM(country), '')
)
WHERE address NOT LIKE '%' || city || '%'
  AND city IS NOT NULL;

-- Final verification - show all businesses with their location info
SELECT id, name, city, country, address
FROM "businesses"
ORDER BY updated_at DESC
LIMIT 20;
