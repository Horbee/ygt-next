-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_availabilityId_fkey";

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "availabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
