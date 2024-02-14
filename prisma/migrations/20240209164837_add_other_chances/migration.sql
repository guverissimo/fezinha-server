/*
  Warnings:

  - A unique constraint covering the columns `[name_double]` on the table `titles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_triple]` on the table `titles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_double` to the `titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_triple` to the `titles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "dozens_double" TEXT[],
ADD COLUMN     "dozens_triple" TEXT[],
ADD COLUMN     "name_double" TEXT NOT NULL,
ADD COLUMN     "name_triple" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "titles_name_double_key" ON "titles"("name_double");

-- CreateIndex
CREATE UNIQUE INDEX "titles_name_triple_key" ON "titles"("name_triple");
