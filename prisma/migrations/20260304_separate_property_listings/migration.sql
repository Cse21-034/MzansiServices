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

-- Simplify Listing status field if it was ListingStatus enum
ALTER TABLE "listings" 
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "status" TYPE TEXT;

-- AddForeignKey for PropertyListing
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE;

-- CreateIndex for property_listings
CREATE INDEX "property_listings_business_id_idx" ON "property_listings"("business_id");
CREATE INDEX "property_listings_status_idx" ON "property_listings"("status");
