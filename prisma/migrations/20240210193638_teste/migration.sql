/*
  Warnings:

  - The `name_double` column on the `titles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `name_triple` column on the `titles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "titles" DROP COLUMN "name_double",
ADD COLUMN     "name_double" TEXT[],
DROP COLUMN "name_triple",
ADD COLUMN     "name_triple" TEXT[];
