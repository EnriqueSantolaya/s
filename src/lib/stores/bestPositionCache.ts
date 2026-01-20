export type BestPosition = {
  altura: number;
  acimut: number;
  energia: number;
};

function paramsHash(params: any) {
  return JSON.stringify(params);
}

export function getCachedBestPosition(params: any): BestPosition | null {
  if (typeof window === 'undefined') return null;

  const key = 'bestPosition_' + paramsHash(params);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

export function setCachedBestPosition(params: any, value: BestPosition) {
  if (typeof window === 'undefined') return;

  const key = 'bestPosition_' + paramsHash(params);
  localStorage.setItem(key, JSON.stringify(value));
}
