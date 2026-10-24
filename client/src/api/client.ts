import type {
  ApiError,
  HealthResponse,
  InterrogateRequest,
  InterrogateResponse,
} from '@mystery/shared';

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(err?.error ?? `${method} ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => request<HealthResponse>('GET', '/health'),
  interrogate: (body: InterrogateRequest) =>
    request<InterrogateResponse>('POST', '/interrogate', body),
};
