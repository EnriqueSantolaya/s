/*
  Warnings:

  - You are about to drop the column `altitude` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `azimuth` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `months` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `altitude` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `azimuth` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `energy` on the `Result` table. All the data in the column will be lost.
  - Added the required column `latitud` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acimut` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altura` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energia` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "altitude",
DROP COLUMN "azimuth",
DROP COLUMN "latitude",
DROP COLUMN "months",
ADD COLUMN     "acimutFijo" INTEGER,
ADD COLUMN     "alturaFija" INTEGER,
ADD COLUMN     "latitud" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "meses" INTEGER[];

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "altitude",
DROP COLUMN "azimuth",
DROP COLUMN "energy",
ADD COLUMN     "acimut" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "altura" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "energia" DOUBLE PRECISION NOT NULL;
