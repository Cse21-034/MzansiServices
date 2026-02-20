-- Run this in your database to check the branch data
SELECT 
  id,
  name,
  branchName,
  isBranch,
  city,
  address,
  parentBusinessId
FROM "Business"
WHERE name LIKE '%Cheza%' OR branchName LIKE '%Windhoek%';
