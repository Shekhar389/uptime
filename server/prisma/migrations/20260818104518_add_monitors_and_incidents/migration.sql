-- DropIndex
DROP INDEX "organisations_logo_key";

-- AlterTable
ALTER TABLE "organisations" ALTER COLUMN "logo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "monitors" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "interval_seconds" INTEGER NOT NULL DEFAULT 60,
    "status" VARCHAR(50) NOT NULL DEFAULT 'up',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "monitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "monitor_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'investigating',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
