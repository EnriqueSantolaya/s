import { calculateEnergyYear } from './calculations';

export interface PanelPosition {
  altura: number;
  acimut: number;
}

export interface PositionResult extends PanelPosition {
  energia: number;
}

export function generatePositions(alturaStep = 5, acimutStep = 5): PanelPosition[] {
  const positions: PanelPosition[] = [];

  for (let altura = 0; altura <= 90; altura += alturaStep) {
    for (let acimut = -180; acimut <= 180; acimut += acimutStep) {
      positions.push({ altura, acimut });
    }
  }

  return positions;
}

export function comparePositionsYear(positions: PanelPosition[], latitud: number): PositionResult[] {
  return positions.map((pos) => ({
    ...pos,
    energia: calculateEnergyYear(
      pos.altura,
      pos.acimut,
      latitud
    )
  }));
}

export function getBestPosition(results: PositionResult[]): PositionResult {
  return results.reduce( (best, current) => current.energia > best.energia ? current : best );
}

export function getTopPositions(results: PositionResult[], top = 5): PositionResult[] {
  return [...results]
    .sort((a, b) => b.energia - a.energia)
    .slice(0, top);
}