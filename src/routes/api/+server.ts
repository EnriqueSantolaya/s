import { json } from '@sveltejs/kit';
import {
  generatePositions,
  comparePositionsYear,
  comparePositionsMonths,
  getBestPosition
} from '$lib/comparisons';

// Get best result
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

  const alturaCookie = cookies.get('altura');
  const acimutCookie = cookies.get('acimut');

  const altura = alturaCookie !== undefined ? Number(alturaCookie) : undefined;
  const acimut = acimutCookie !== undefined ? Number(acimutCookie) : undefined;

  if ( (altura !== undefined && Number.isNaN(altura)) || (acimut !== undefined && Number.isNaN(acimut)) ) {
    return json(
        { error: 'Invalid altura or acimut in cookies' }, 
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

  const mesesCookie = cookies.get('meses');
  const meses = mesesCookie !== undefined
    ? mesesCookie
        .split(',')
        .map(Number)
        .filter(m => m >= 1 && m <= 12)
    : undefined;
  
  const results = meses && meses.length > 0
    ? comparePositionsMonths(positions, latitud, meses)
    : comparePositionsYear(positions, latitud);

  const best = getBestPosition(results);

  return json(best);
}
