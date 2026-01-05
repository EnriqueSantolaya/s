export interface ObstacleBase {
    name: string;   
    distancia: number;   
    alturaFisica: number;
    acimutCentro: number;
    anchoFactor: number;
}

export interface RectangleObstacle extends ObstacleBase {
    type: 'rectangle';
}

export interface TriangleObstacle extends ObstacleBase {
    type: 'triangle';
}

export type Obstacle = RectangleObstacle | TriangleObstacle;

export function isBlockedByObstacle(alturaS: number, acimutS: number, obstacles: Obstacle[]): boolean {
    for (const obs of obstacles) {
        const alturaAngular = Math.atan2(obs.alturaFisica, obs.distancia) * (180 / Math.PI);
        const anchoAngular = alturaAngular * obs.anchoFactor;
        const acimutMin = obs.acimutCentro - anchoAngular / 2;
        const acimutMax = obs.acimutCentro + anchoAngular / 2;

        if (obs.type === 'rectangle') {
            if (
                alturaS <= alturaAngular &&
                acimutS >= acimutMin && acimutS <= acimutMax
            ) {
                return true;
            }
        } else if (obs.type === 'triangle') {
            const acimutCentro = (acimutMin + acimutMax) / 2;
            const alturaMaxActual = acimutS <= acimutCentro
                ? (acimutS - acimutMin) * (alturaAngular / (acimutCentro - acimutMin))
                : (acimutMax - acimutS) * (alturaAngular / (acimutMax - acimutCentro));
            if (acimutS >= acimutMin && acimutS <= acimutMax && alturaS <= alturaMaxActual) {
                return true;
            }
        }
    }
    return false;
}