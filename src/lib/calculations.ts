const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function calculateEnergyMoment(alturaP:number, acimutP:number, latitud:number, dia:number, hora:number): number{
    const declinS = -23.5 * Math.sin( 2 * Math.PI * (284 + dia) / 365 );
    const angulo_horario = 15 * ( hora - 12 );

    const sinAlturaS = Math.sin(declinS) * Math.sin(latitud) + Math.cos(declinS) * Math.cos(latitud) * Math.cos(angulo_horario);
    const alturaS = Math.asin(sinAlturaS);
    if ( alturaS <= 0.1 ) return 0;

    const cosAcimutS = ( Math.sin(alturaS) * Math.sin(latitud) - Math.sin(declinS) ) / ( Math.cos(alturaS) * Math.cos(latitud) );
    const acimutS = Math.acos(cosAcimutS);

    const cosIncidencia = Math.sin(alturaS) * Math.sin(alturaP) + Math.cos(alturaS) * Math.cos(alturaP) * Math.cos(acimutS - acimutP);

    const fOrbital = 1 + 0.033 * Math.cos( 2*Math.PI*dia / 365 );
    const extincion = 1 / Math.sin(alturaS);

    return 1367 * fOrbital * extincion * cosIncidencia;
}

export function calculateEnergyRange(alturaP:number, acimutP:number, latitud:number, diaInicio:number,diaFin:number ): number{
    let energiaTotal = 0;

    for (let dia = diaInicio; dia <= diaFin; dia++) {
        for (let hora = 0; hora < 24; hora++) {

            const energiaHora = calculateEnergyMoment(alturaP, acimutP, latitud, dia, hora);

            if (energiaHora > 0) energiaTotal += energiaHora;
        }
    }

    return energiaTotal;
}

export function calculateEnergyYear(alturaP:number, acimutP:number, latitud:number): number{
    return calculateEnergyRange(alturaP, acimutP, latitud, 1, 365);
}

function calculateEnergyMonth(alturaP:number, acimutP:number, latitud:number, mes:number): number{
    let diaInicio = 1;

    for (let m = 1; m < mes; m++){
        diaInicio += diasPorMes[m - 1];
    }

    const diaFin = diaInicio + diasPorMes[mes - 1] - 1;

    return calculateEnergyRange(alturaP, acimutP, latitud, diaInicio, diaFin);
}

export function calculateEnergyMonths(alturaP: number, acimutP: number, latitud: number, meses: number[]): number {
    let energiaTotal = 0;

    for (const mes of meses) {
        if (mes < 1 || mes > 12) continue; 
        energiaTotal += calculateEnergyMonth(alturaP, acimutP, latitud, mes);
    }

    return energiaTotal;
}
