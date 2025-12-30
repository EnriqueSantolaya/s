import type {  Obstacle } from '$lib/obstacles';
import { isBlockedByObstacle } from '$lib/obstacles'; 
const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function deg2rad(deg: number): number {
    return deg * Math.PI / 180;
}

function rad2deg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function calculateEnergyMoment(alturaP:number, acimutP:number, latitud:number, dia:number, hora:number, obstacles:Obstacle[] = []): number{
    // Mirar tests para ver si esta bien
    const declinS = deg2rad( 23.5 * Math.sin( 2 * Math.PI * (284 + dia) / 365 ));
    const angulo_horario = deg2rad( 15 * ( hora - 12 ));

    const sinAlturaS = Math.sin(declinS) * Math.sin(deg2rad(latitud)) + Math.cos(declinS) * Math.cos(deg2rad(latitud)) * Math.cos(angulo_horario);
    const alturaS = Math.asin(sinAlturaS);
    if ( rad2deg(alturaS) <= 0.05 ) return 0;

    const cosAcimutS = ( Math.sin(alturaS) * Math.sin(deg2rad(latitud)) - Math.sin(declinS) ) / ( Math.cos(alturaS) * Math.cos(deg2rad(latitud)) );
    const cosA = Math.max(-1, Math.min(1, cosAcimutS));
    let acimutS = Math.acos(cosA);
    if (angulo_horario > 0) {
       acimutS = 2 * Math.PI - acimutS;
    }

    if (isBlockedByObstacle( rad2deg(alturaS), rad2deg(acimutS), obstacles)) {
        return 0;
    }

    const cosIncidencia = Math.sin(alturaS) * Math.sin(deg2rad(alturaP)) + Math.cos(alturaS) * Math.cos(deg2rad(alturaP)) * Math.cos(acimutS - deg2rad(acimutP));

    const fOrbital = 1 + 0.033 * Math.cos( 2*Math.PI*dia / 365 );
    const extincion = 1 / Math.sin(alturaS);

    return 1367 * fOrbital * extincion * Math.max(0, cosIncidencia);
}

export function calculateEnergyRange(alturaP:number, acimutP:number, latitud:number, diaInicio:number, diaFin:number, obstacles:Obstacle[] = [] ): number{
    let energiaTotal = 0;

    for (let dia = diaInicio; dia <= diaFin; dia++) {
        for (let hora = 0; hora < 24; hora++) {

            const energiaHora = calculateEnergyMoment(alturaP, acimutP, latitud, dia, hora, obstacles);

            if (energiaHora > 0) energiaTotal += energiaHora;
        }
    }

    return energiaTotal;
}

export function calculateEnergyYear(alturaP:number, acimutP:number, latitud:number, obstacles:Obstacle[] = []): number{
    return calculateEnergyRange(alturaP, acimutP, latitud, 1, 365, obstacles);
}

function calculateEnergyMonth(alturaP:number, acimutP:number, latitud:number, mes:number, obstacles:Obstacle[] = []): number{
    let diaInicio = 1;

    for (let m = 1; m < mes; m++){
        diaInicio += diasPorMes[m - 1];
    }

    const diaFin = diaInicio + diasPorMes[mes - 1] - 1;

    return calculateEnergyRange(alturaP, acimutP, latitud, diaInicio, diaFin, obstacles);
}

export function calculateEnergyMonths(alturaP: number, acimutP: number, latitud: number, meses: number[], obstacles:Obstacle[] = []): number {
    let energiaTotal = 0;

    for (const mes of meses) {
        if (mes < 1 || mes > 12) continue; 
        energiaTotal += calculateEnergyMonth(alturaP, acimutP, latitud, mes, obstacles);
    }

    return energiaTotal;
}
