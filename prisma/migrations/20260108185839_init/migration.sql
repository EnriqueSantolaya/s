-- CreateTable
CREATE TABLE "Obstacle" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distancia" DOUBLE PRECISION NOT NULL,
    "alturaFisica" DOUBLE PRECISION NOT NULL,
    "acimutCentro" DOUBLE PRECISION NOT NULL,
    "anchoFactor" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Obstacle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Obstacle" ADD CONSTRAINT "Obstacle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
