import { json } from '@sveltejs/kit';
import {
  generatePositions,
  comparePositionsYear,
  comparePositionsMonths,
  getBestPosition
} from '$lib/comparisons';
import type { Obstacle } from '$lib/obstacles.js';

// Get best result
export async function POST({ request }) { 

  const body = await request.json();

  const { latitud, altura, acimut, meses, elevacionPlaca, obstacles } = body as {
    latitud: number;
    altura?: number;
    acimut?: number;
    meses?: number[];
    elevacionPlaca: number;
    obstacles?: Obstacle[];
  };

  if (latitud === undefined || Number.isNaN(latitud)) {
    return json(
      { error: 'Invalid latitud' },
      { status: 400 }
    );
  }

  if ( (altura !== undefined && Number.isNaN(altura)) || (acimut !== undefined && Number.isNaN(acimut)) ) {
    return json(
        { error: 'Invalid altura or acimut' }, 
        { status: 400 }
    );
  }

  if (elevacionPlaca !== undefined && Number.isNaN(elevacionPlaca)) {
    return json(
      { error: 'Invalid elevacion de placa' },
      { status: 400 }
    );
  }

  if (altura !== undefined && acimut !== undefined) {
    return json(
      { error: 'Provide either altura or acimut, not both' },
      { status: 400 }
    );
  }

  const positions = generatePositions(5, 5, altura, acimut);

  const results = meses && meses.length > 0
    ? comparePositionsMonths(positions, latitud, meses, elevacionPlaca, obstacles)
    : comparePositionsYear(positions, latitud, elevacionPlaca, obstacles);

  const best = getBestPosition(results);

  return json(best);
}
