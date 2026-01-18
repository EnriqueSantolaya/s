import { json } from '@sveltejs/kit';
import type { Obstacle } from '$lib/obstacles';
import {
  calculateEnergyYear,
  calculateEnergyMonths
} from '$lib/calculations';

export async function POST({ request }) {
  const body = await request.json();

  const {
    latitud,
    meses,
    obstacles,
    acimut: acimutBody,
    altura: alturaBody
  } = body as {
    latitud: number;
    meses?: number[];
    obstacles?: Obstacle[];
    acimut?: number;
    altura?: number;
  };

  // Validaciones básicas
  if (latitud === undefined || Number.isNaN(latitud)) {
    return json(
      { error: 'Invalid latitud' },
      { status: 400 }
    );
  }

  let acimut: number = acimutBody !== undefined
    ? acimutBody
    : latitud < 0 ? 180 : 0;

  let altura: number = alturaBody !== undefined
    ? alturaBody
    : 3.1 + Math.abs(latitud) * 0.76;

  let energia: number;

  if (meses && meses.length > 0) {
    energia = calculateEnergyMonths(
      altura,
      acimut,
      latitud,
      meses,
      obstacles
    );
  } else {
    energia = calculateEnergyYear(
      altura,
      acimut,
      latitud,
      obstacles
    );
  }

  return json(energia);
}
