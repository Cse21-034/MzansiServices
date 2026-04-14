-- Add payRequestId column to payments table
ALTER TABLE "payments" ADD COLUMN "pay_request_id" TEXT;

-- Create unique constraint on pay_request_id
CREATE UNIQUE INDEX "payments_pay_request_id_key" ON "payments"("pay_request_id");
