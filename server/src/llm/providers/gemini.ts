// Google Gemini via the REST API (https://ai.google.dev/api/generate-content).
// Plain fetch, no SDK, so the request/response shape is visible here.

import {
  LlmError,
  type LlmProvider,
  type ProviderRequest,
  type ProviderResponse,
  type TokenUsage,
} from '../types';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const NAME = 'gemini';

// A murder mystery talks about poison and killing. Only block the most severe content,
// otherwise the default filters can refuse ordinary in-story answers.
const SAFETY_SETTINGS = [
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
].map((category) => ({ category, threshold: 'BLOCK_ONLY_HIGH' }));

interface GeminiPart {
  text?: string;
  thought?: boolean;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
    totalTokenCount?: number;
  };
}

interface GeminiErrorBody {
  error?: {
    message?: string;
    status?: string;
    details?: { '@type'?: string; retryDelay?: string }[];
  };
}

export function createGeminiProvider(apiKey: string): LlmProvider {
  /** Sends the request and turns HTTP / network failures into LlmErrors. */
  async function post(req: ProviderRequest, signal: AbortSignal, stream: boolean) {
    if (!apiKey) {
      throw new LlmError('LLM_API_KEY is not set in server/.env', {
        provider: NAME,
        retryable: false,
      });
    }

    const method = stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
    let res: Response;
    try {
      res = await fetch(`${BASE_URL}/${encodeURIComponent(req.model)}:${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(buildBody(req)),
        signal,
      });
    } catch (err) {
      // Aborts (timeout or caller) are handled by callModel; anything else is a network error.
      if (signal.aborted) throw err;
      throw new LlmError(`Network error: ${(err as Error).message}`, {
        provider: NAME,
        retryable: true,
      });
    }

    if (!res.ok) throw await httpError(res);
    return res;
  }

  return {
    name: NAME,

    async generate(req, signal) {
      const res = await post(req, signal, false);
      const data = (await res.json()) as GeminiResponse;
      checkBlocked(data);
      const candidate = data.candidates?.[0];
      return finish(answerText(data), candidate?.finishReason ?? 'UNKNOWN', usageOf(data));
    },

    // The stream is Server-Sent Events: lines of "data: {json}", each json a partial
    // response with the next piece of text. The last one carries finishReason and usage.
    async generateStream(req, signal, onText) {
      const res = await post(req, signal, true);
      if (!res.body)
        throw new LlmError('Gemini sent no stream body', { provider: NAME, retryable: true });

      let text = '';
      let finishReason = 'UNKNOWN';
      let usage = usageOf({});
      let buffered = '';
      const decoder = new TextDecoder();

      const handleLine = (line: string) => {
        if (!line.startsWith('data:')) return;
        const data = JSON.parse(line.slice(5)) as GeminiResponse;
        checkBlocked(data);
        const piece = answerText(data);
        if (piece) {
          text += piece;
          onText(piece);
        }
        finishReason = data.candidates?.[0]?.finishReason ?? finishReason;
        if (data.usageMetadata) usage = usageOf(data);
      };

      try {
        for await (const chunk of res.body) {
          buffered += decoder.decode(chunk, { stream: true });
          const lines = buffered.split(/\r?\n/);
          buffered = lines.pop() ?? ''; // keep a half-received line for the next chunk
          lines.forEach(handleLine);
        }
        handleLine(buffered.trim());
      } catch (err) {
        if (signal.aborted || err instanceof LlmError) throw err;
        throw new LlmError(`Stream broke: ${(err as Error).message}`, {
          provider: NAME,
          retryable: true,
        });
      }

      return finish(text, finishReason, usage);
    },
  };
}

function buildBody(req: ProviderRequest) {
  const generationConfig: Record<string, unknown> = {};
  if (req.temperature !== undefined) generationConfig.temperature = req.temperature;
  if (req.maxOutputTokens !== undefined) generationConfig.maxOutputTokens = req.maxOutputTokens;
  if (req.json) {
    generationConfig.responseMimeType = 'application/json';
    if (typeof req.json === 'object') generationConfig.responseJsonSchema = req.json;
  }

  return {
    ...(req.system && { systemInstruction: { parts: [{ text: req.system }] } }),
    contents: req.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig,
    safetySettings: SAFETY_SETTINGS,
  };
}

async function httpError(res: Response): Promise<LlmError> {
  const errBody = (await res.json().catch(() => ({}))) as GeminiErrorBody;
  const retryDelay = errBody.error?.details?.find((d) =>
    d['@type']?.endsWith('RetryInfo'),
  )?.retryDelay; // e.g. "17s"
  return new LlmError(
    `Gemini ${res.status} ${errBody.error?.status ?? ''}: ${errBody.error?.message ?? res.statusText}`,
    {
      provider: NAME,
      status: res.status,
      retryable: res.status === 429 || res.status >= 500,
      retryAfterMs: retryDelay ? parseFloat(retryDelay) * 1000 : undefined,
    },
  );
}

function checkBlocked(data: GeminiResponse) {
  if (data.promptFeedback?.blockReason) {
    throw new LlmError(`Prompt blocked by Gemini: ${data.promptFeedback.blockReason}`, {
      provider: NAME,
      retryable: false,
    });
  }
}

/** The answer text, skipping "thought" parts (the model's hidden reasoning). */
function answerText(data: GeminiResponse): string {
  return (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join('');
}

function usageOf(data: GeminiResponse): TokenUsage {
  const u = data.usageMetadata ?? {};
  return {
    inputTokens: u.promptTokenCount ?? 0,
    outputTokens: u.candidatesTokenCount ?? 0,
    thinkingTokens: u.thoughtsTokenCount ?? 0,
    totalTokens: u.totalTokenCount ?? 0,
  };
}

function finish(text: string, finishReason: string, usage: TokenUsage): ProviderResponse {
  if (!text && finishReason !== 'MAX_TOKENS') {
    throw new LlmError(`Gemini returned no text (finishReason: ${finishReason})`, {
      provider: NAME,
      retryable: finishReason !== 'SAFETY',
    });
  }
  return { text, finishReason, usage };
}
