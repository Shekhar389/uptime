/*
  Warnings:

  - You are about to drop the column `team_id` on the `monitors` table. All the data in the column will be lost.
  - The `status` column on the `monitors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `organisation_id` to the `monitors` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MonitorStatus" AS ENUM ('up', 'down', 'degraded');

-- CreateEnum
CREATE TYPE "MonitorType" AS ENUM ('http');

-- AlterTable
ALTER TABLE "monitors" DROP COLUMN "team_id",
ADD COLUMN     "organisation_id" UUID NOT NULL,
ADD COLUMN     "type" "MonitorType" NOT NULL DEFAULT 'http',
ALTER COLUMN "interval_seconds" SET DEFAULT 180,
DROP COLUMN "status",
ADD COLUMN     "status" "MonitorStatus" NOT NULL DEFAULT 'up';

-- AddForeignKey
ALTER TABLE "monitors" ADD CONSTRAINT "monitors_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
