export interface ObstacleBase {
    name: string;      
    acimutMin: number;
    acimutMax: number;
    altura: number;
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
        if (obs.type === 'rectangle') {
            if (
                alturaS <= obs.altura &&
                acimutS >= obs.acimutMin && acimutS <= obs.acimutMax
            ) {
                return true;
            }
        } else if (obs.type === 'triangle') {
            const acimutCentro = (obs.acimutMin + obs.acimutMax) / 2;
            const alturaMaxActual = acimutS <= acimutCentro
                ? (acimutS - obs.acimutMin) * (obs.altura / (acimutCentro - obs.acimutMin))
                : (obs.acimutMax - acimutS) * (obs.altura / (obs.acimutMax - acimutCentro));
            if (acimutS >= obs.acimutMin && acimutS <= obs.acimutMax && alturaS <= alturaMaxActual) {
                return true;
            }
        }
    }
    return false;
}