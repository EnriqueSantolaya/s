export type Obstacle = {
    name: string;
    distancia: number;
    alturaFisica: number;
    acimutCentro: number;
    anchoFactor: number;
    type: 'tree' | 'mountain' | 'building' | 'wall' | 'custom';
};

export function isBlockedByObstacle(alturaS: number, acimutS: number, elevacionPlaca: number, obstacles: Obstacle[]): boolean {
    for (const obs of obstacles) {
        const alturaEfectiva = Math.max(0, obs.alturaFisica - elevacionPlaca);
        const alturaAngular = Math.atan2(alturaEfectiva, obs.distancia) * (180 / Math.PI);
        const anchoAngular = alturaAngular * obs.anchoFactor;
        const acimutMin = obs.acimutCentro - anchoAngular / 2;
        const acimutMax = obs.acimutCentro + anchoAngular / 2;

        const geometricType = getGeometricType(obs.type);

        if (geometricType === 'rectangle') {
            if (
                alturaS <= alturaAngular &&
                acimutS >= acimutMin && acimutS <= acimutMax
            ) {
                return true;
            }
        } else if (geometricType === 'triangle') {
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

function getGeometricType(type: 'tree' | 'mountain' | 'building' | 'wall' | 'custom'): 'rectangle' | 'triangle' {
    switch (type) {
        case 'tree':
        case 'mountain':
            return 'triangle'; // Los árboles y montañas son triángulos
        case 'building':
        case 'wall':
        case 'custom':
            return 'rectangle';  // Los edificios y paredes son rectángulos
        default:
            return 'rectangle';  // Default
    }
}