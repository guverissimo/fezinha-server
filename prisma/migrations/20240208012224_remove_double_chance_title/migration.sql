/*
  Warnings:

  - You are about to drop the `titles_double_chance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "titles_double_chance" DROP CONSTRAINT "titles_double_chance_buyed_title_id_fkey";

-- DropForeignKey
ALTER TABLE "titles_double_chance" DROP CONSTRAINT "titles_double_chance_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "titles_double_chance" DROP CONSTRAINT "titles_double_chance_user_id_fkey";

-- AlterTable
ALTER TABLE "titles" ADD COLUMN     "relation_titles" TEXT[];

-- DropTable
DROP TABLE "titles_double_chance";
