import { json } from '@sveltejs/kit';
import type { Obstacle } from '$lib/obstacles';
import { calculateEnergyFirstDayOfMonths } from '$lib/calculations.js';

export async function POST({ request }) {
    const body = await request.json();

    const { latitud, altura, acimut, meses, obstacles } = body as {
        latitud: number;
        altura: number;
        acimut: number;
        meses: number[];
        obstacles?: Obstacle[];
    };

    if (
        latitud === undefined ||
        altura === undefined ||
        acimut === undefined
    ) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }

    const mesesNormalizados =
        Array.isArray(meses) && meses.length > 0
            ? meses
            : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const resultados = calculateEnergyFirstDayOfMonths(
        altura,
        acimut,
        latitud,
        mesesNormalizados,
        obstacles
    );

    return json(resultados);
}
