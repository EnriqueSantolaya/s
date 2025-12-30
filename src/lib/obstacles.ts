export type Obstacle = RectangleObstacle | TriangleObstacle;

export interface RectangleObstacle {
    type: 'rectangle';
    acimutMin: number;
    acimutMax: number;
    altura: number;
}

export interface TriangleObstacle {
    type: 'triangle';
    acimutMin: number;
    acimutMax: number;
    altura: number;
}

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