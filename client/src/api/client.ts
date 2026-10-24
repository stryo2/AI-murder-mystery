import type {
  AccusationRequest,
  AccusationStatus,
  ApiError,
  CaseBriefing,
  CharacterSummary,
  HealthResponse,
  HistoryResponse,
  InterrogateRequest,
  InterrogateResponse,
  InterrogateStreamEvent,
  NotebookRequest,
  NotebookResponse,
  SceneResponse,
  SearchRequest,
  SearchResponse,
  Verdict,
} from '@mystery/shared';

async function errorFrom(res: Response, label: string): Promise<Error> {
  const err = (await res.json().catch(() => null)) as ApiError | null;
  return new Error(err?.error ?? `${label} failed: ${res.status}`);
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw await errorFrom(res, `${method} ${path}`);
  return (await res.json()) as T;
}

/**
 * Asks a question and streams the reply: onText gets each new piece as it arrives.
 * Resolves with the full reply. The server sends one JSON event per line.
 */
async function interrogateStream(
  body: InterrogateRequest,
  onText: (text: string) => void,
): Promise<string> {
  const res = await fetch('/api/interrogate/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await errorFrom(res, 'Question');
  if (!res.body) throw new Error('No reply stream');

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffered = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffered += value;
    const lines = buffered.split('\n');
    buffered = lines.pop() ?? ''; // a half-received line waits for the next chunk
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as InterrogateStreamEvent;
      if (event.type === 'text') onText(event.text);
      else if (event.type === 'done') return event.reply;
      else throw new Error(event.error);
    }
  }
  throw new Error('The reply was cut off. Try again.');
}

export const api = {
  health: () => request<HealthResponse>('GET', '/health'),
  briefing: () => request<CaseBriefing>('GET', '/case'),
  accusation: (sessionId: string) =>
    request<AccusationStatus>('GET', `/accusation?${new URLSearchParams({ sessionId })}`),
  accuse: (body: AccusationRequest) => request<Verdict>('POST', '/accusation', body),
  notes: (sessionId: string) =>
    request<NotebookResponse>('GET', `/notebook?${new URLSearchParams({ sessionId })}`),
  saveNotes: (body: NotebookRequest) => request<NotebookResponse>('PUT', '/notebook', body),
  characters: () => request<CharacterSummary[]>('GET', '/characters'),
  history: (sessionId: string, characterId: string) =>
    request<HistoryResponse>(
      'GET',
      `/interrogate/history?${new URLSearchParams({ sessionId, characterId })}`,
    ),
  scene: (sessionId: string) =>
    request<SceneResponse>('GET', `/scene?${new URLSearchParams({ sessionId })}`),
  search: (body: SearchRequest) => request<SearchResponse>('POST', '/scene/search', body),
  interrogate: (body: InterrogateRequest) =>
    request<InterrogateResponse>('POST', '/interrogate', body),
  interrogateStream,
};
