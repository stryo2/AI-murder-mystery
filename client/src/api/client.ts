import type { HealthResponse } from '@mystery/shared';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  health: () => getJson<HealthResponse>('/health'),
};
