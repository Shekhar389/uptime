-- AlterTable
ALTER TABLE "monitors" ADD COLUMN     "consecutive_fails" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_checked_at" TIMESTAMPTZ,
ALTER COLUMN "interval_seconds" SET DEFAULT 300;
