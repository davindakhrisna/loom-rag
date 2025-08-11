-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "activity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notesvisibility" BOOLEAN NOT NULL DEFAULT false;
