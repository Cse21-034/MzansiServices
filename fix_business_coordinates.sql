-- Quick fix: Update existing businesses with default coordinates based on city
-- Run this to fix "Location not available" for existing businesses

-- Windhoek businesses
UPDATE "Business" 
SET latitude = -22.5597, longitude = 17.0832 
WHERE (city ILIKE '%windhoek%' OR address ILIKE '%windhoek%') 
  AND (latitude IS NULL OR latitude = 0);

-- Rundu businesses  
UPDATE "Business" 
SET latitude = -21.1700, longitude = 27.5086 
WHERE (city ILIKE '%francistown%' OR address ILIKE '%francistown%') 
  AND (latitude IS NULL OR latitude = 0);

-- Maun businesses
UPDATE "Business" 
SET latitude = -19.9833, longitude = 23.4167 
WHERE (city ILIKE '%maun%' OR address ILIKE '%maun%') 
  AND (latitude IS NULL OR latitude = 0);

-- Kasane businesses
UPDATE "Business" 
SET latitude = -17.8167, longitude = 25.1500 
WHERE (city ILIKE '%kasane%' OR address ILIKE '%kasane%') 
  AND (latitude IS NULL OR latitude = 0);

-- Palapye businesses
UPDATE "Business" 
SET latitude = -22.5500, longitude = 27.1333 
WHERE (city ILIKE '%palapye%' OR address ILIKE '%palapye%') 
  AND (latitude IS NULL OR latitude = 0);

-- Serowe businesses
UPDATE "Business" 
SET latitude = -22.3833, longitude = 26.7167 
WHERE (city ILIKE '%serowe%' OR address ILIKE '%serowe%') 
  AND (latitude IS NULL OR latitude = 0);

-- Check results
SELECT name, city, address, latitude, longitude, isBranch, branchName
FROM "Business"
WHERE latitude IS NOT NULL
ORDER BY createdAt DESC;
