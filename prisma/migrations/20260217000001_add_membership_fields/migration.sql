-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('NONE', 'ACTIVE', 'EXPIRED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN "membership_card_image" TEXT,
ADD COLUMN "membership_number" TEXT,
ADD COLUMN "membership_status" "MembershipStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN "membership_type" TEXT,
ADD COLUMN "membership_expiry_date" TIMESTAMP(3),
ADD COLUMN "membership_provider" TEXT,
ADD COLUMN "membership_uploaded_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_membership_number_key" ON "businesses"("membership_number");
