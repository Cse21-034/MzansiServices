-- Add property-specific fields to listings table
ALTER TABLE "listings" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "listings" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "listings" ADD COLUMN "beds" INTEGER;
ALTER TABLE "listings" ADD COLUMN "baths" INTEGER;
ALTER TABLE "listings" ADD COLUMN "price_per_night" DOUBLE PRECISION;
ALTER TABLE "listings" ADD COLUMN "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "listings" ADD COLUMN "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "listings" ADD COLUMN "rules" TEXT;
ALTER TABLE "listings" ADD COLUMN "address" TEXT;
ALTER TABLE "listings" ADD COLUMN "city" TEXT;
ALTER TABLE "listings" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "listings" ADD COLUMN "longitude" DOUBLE PRECISION;
ALTER TABLE "listings" ADD COLUMN "min_nights" INTEGER;
ALTER TABLE "listings" ADD COLUMN "max_nights" INTEGER;
