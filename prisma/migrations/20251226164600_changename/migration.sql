/*
  Warnings:

  - You are about to drop the column `acimutFijo` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `alturaFija` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `latitud` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `meses` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `acimut` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `altura` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `energia` on the `Result` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altitude` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `azimuth` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energy` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "acimutFijo",
DROP COLUMN "alturaFija",
DROP COLUMN "latitud",
DROP COLUMN "meses",
ADD COLUMN     "altitude" INTEGER,
ADD COLUMN     "azimuth" INTEGER,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "months" INTEGER[];

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "acimut",
DROP COLUMN "altura",
DROP COLUMN "energia",
ADD COLUMN     "altitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "azimuth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "energy" DOUBLE PRECISION NOT NULL;
