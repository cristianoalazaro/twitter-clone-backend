/*
  Warnings:

  - You are about to drop the column `useSlug` on the `Tweet` table. All the data in the column will be lost.
  - Added the required column `userSlug` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_useSlug_fkey";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "useSlug",
ADD COLUMN     "userSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "User"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
