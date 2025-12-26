/*
  Warnings:

  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "acimut" DOUBLE PRECISION,
ADD COLUMN     "altura" DOUBLE PRECISION,
ADD COLUMN     "energia" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Result";
