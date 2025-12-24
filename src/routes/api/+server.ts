import { json } from '@sveltejs/kit';
import {
  generatePositions,
  comparePositionsYear,
  comparePositionsMonths,
  getBestPosition
} from '$lib/comparisons';

export function GET({ cookies }) {
  const latitudCookie = cookies.get('latitud');

  if (!latitudCookie) {
    return json(
      { error: 'Latitud not found in cookies' },
      { status: 400 }
    );
  }

  const latitud = Number(latitudCookie);
  if (Number.isNaN(latitud)) {
    return json(
      { error: 'Invalid latitud in cookies' },
      { status: 400 }
    );
  }

  const mesesCookie = cookies.get('meses');

  const positions = generatePositions(5, 5);
  let results;

  if (mesesCookie) {
    const meses = mesesCookie
      .split(',')
      .map(Number)
      .filter(m => m >= 1 && m <= 12);

    results = comparePositionsMonths(positions, latitud, meses);
  } else {
    results = comparePositionsYear(positions, latitud);
  }

  const best = getBestPosition(results);

  return json(best);
}
