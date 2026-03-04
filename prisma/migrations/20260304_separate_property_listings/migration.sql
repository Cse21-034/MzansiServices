-- CreateTable PropertyListing
CREATE TABLE "property_listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "business_id" TEXT NOT NULL,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Accommodation',
    "type" TEXT NOT NULL DEFAULT 'Rental',
    "beds" INTEGER,
    "baths" INTEGER,
    "price_per_night" DOUBLE PRECISION,
    "amenities" TEXT[],
    "features" TEXT[],
    "rules" TEXT,
    "address" TEXT,
    "city" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "min_nights" INTEGER,
    "max_nights" INTEGER,

    CONSTRAINT "property_listings_pkey" PRIMARY KEY ("id")
);

-- Migrate existing property listings from listings table to property_listings
INSERT INTO "property_listings" (
    "id", "title", "description", "image", "status", "business_id",
    "approved_by", "approved_at", "rejection_reason", "created_at", "updated_at",
    "category", "type", "beds", "baths", "price_per_night", "amenities", 
    "features", "rules", "address", "city", "latitude", "longitude", 
    "min_nights", "max_nights"
)
SELECT 
    id, title, description, image, 
    CASE WHEN status = 'PENDING' THEN 'PENDING' 
         WHEN status = 'APPROVED' THEN 'APPROVED'
         WHEN status = 'REJECTED' THEN 'REJECTED'
         WHEN status = 'SUSPENDED' THEN 'SUSPENDED'
         ELSE 'PENDING' END,
    business_id,
    approved_by, approved_at, rejection_reason, created_at, updated_at,
    COALESCE(category, 'Accommodation'), 
    COALESCE(type, 'Rental'),
    beds, baths, price_per_night, amenities, features, rules, address, city,
    latitude, longitude, min_nights, max_nights
FROM "listings" 
WHERE (amenities IS NOT NULL AND amenities != ARRAY[]::TEXT[]) 
   OR (category IS NOT NULL AND category != 'General')
   OR (type IS NOT NULL AND type != 'General')
   OR (beds IS NOT NULL)
   OR (baths IS NOT NULL)
   OR (price_per_night IS NOT NULL);

-- RemoveProperty-specific fields from Listing table
ALTER TABLE "listings" 
DROP COLUMN IF EXISTS "category",
DROP COLUMN IF EXISTS "type",
DROP COLUMN IF EXISTS "beds",
DROP COLUMN IF EXISTS "baths",
DROP COLUMN IF EXISTS "price_per_night",
DROP COLUMN IF EXISTS "amenities",
DROP COLUMN IF EXISTS "features",
DROP COLUMN IF EXISTS "rules",
DROP COLUMN IF EXISTS "address",
DROP COLUMN IF EXISTS "city",
DROP COLUMN IF EXISTS "latitude",
DROP COLUMN IF EXISTS "longitude",
DROP COLUMN IF EXISTS "min_nights",
DROP COLUMN IF EXISTS "max_nights",
DROP COLUMN IF EXISTS "approved_by",
DROP COLUMN IF EXISTS "approved_at",
DROP COLUMN IF EXISTS "rejection_reason";

-- Simplify Listing status field - set all to ACTIVE and change type to TEXT
ALTER TABLE "listings" DROP COLUMN "status";
ALTER TABLE "listings" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey for PropertyListing
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE;

-- CreateIndex for property_listings
CREATE INDEX "property_listings_business_id_idx" ON "property_listings"("business_id");
CREATE INDEX "property_listings_status_idx" ON "property_listings"("status");
