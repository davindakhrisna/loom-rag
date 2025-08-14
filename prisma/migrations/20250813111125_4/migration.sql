/*
  Warnings:

  - You are about to drop the column `activity` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "activity",
ADD COLUMN     "activityvisibility" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "punchcard" SET DEFAULT 'Im a helpful AI assistant, ready to serve your needs.';
