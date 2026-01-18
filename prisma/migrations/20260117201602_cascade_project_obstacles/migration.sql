-- DropForeignKey
ALTER TABLE "Obstacle" DROP CONSTRAINT "Obstacle_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Obstacle" ADD CONSTRAINT "Obstacle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
