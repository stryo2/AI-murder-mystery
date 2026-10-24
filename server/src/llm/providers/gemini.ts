// Google Gemini via the REST API (https://ai.google.dev/api/generate-content).
// Plain fetch, no SDK, so the request/response shape is visible here.

import { LlmError, type LlmProvider, type ProviderRequest, type ProviderResponse } from '../types';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

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
  const name = 'gemini';

  return {
    name,
    async generate(req: ProviderRequest, signal: AbortSignal): Promise<ProviderResponse> {
      if (!apiKey) {
        throw new LlmError('LLM_API_KEY is not set in server/.env', {
          provider: name,
          retryable: false,
        });
      }

      const generationConfig: Record<string, unknown> = {};
      if (req.temperature !== undefined) generationConfig.temperature = req.temperature;
      if (req.maxOutputTokens !== undefined) generationConfig.maxOutputTokens = req.maxOutputTokens;
      if (req.json) {
        generationConfig.responseMimeType = 'application/json';
        if (typeof req.json === 'object') generationConfig.responseJsonSchema = req.json;
      }

      const body = {
        ...(req.system && { systemInstruction: { parts: [{ text: req.system }] } }),
        contents: req.messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig,
        safetySettings: SAFETY_SETTINGS,
      };

      let res: Response;
      try {
        res = await fetch(`${BASE_URL}/${encodeURIComponent(req.model)}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(body),
          signal,
        });
      } catch (err) {
        // Aborts (timeout or caller) are handled by callModel; anything else is a network error.
        if (signal.aborted) throw err;
        throw new LlmError(`Network error: ${(err as Error).message}`, {
          provider: name,
          retryable: true,
        });
      }

      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as GeminiErrorBody;
        const retryDelay = errBody.error?.details?.find((d) =>
          d['@type']?.endsWith('RetryInfo'),
        )?.retryDelay; // e.g. "17s"
        throw new LlmError(
          `Gemini ${res.status} ${errBody.error?.status ?? ''}: ${errBody.error?.message ?? res.statusText}`,
          {
            provider: name,
            status: res.status,
            retryable: res.status === 429 || res.status >= 500,
            retryAfterMs: retryDelay ? parseFloat(retryDelay) * 1000 : undefined,
          },
        );
      }

      const data = (await res.json()) as GeminiResponse;

      if (data.promptFeedback?.blockReason) {
        throw new LlmError(`Prompt blocked by Gemini: ${data.promptFeedback.blockReason}`, {
          provider: name,
          retryable: false,
        });
      }

      const candidate = data.candidates?.[0];
      const finishReason = candidate?.finishReason ?? 'UNKNOWN';
      // Skip "thought" parts: they are the model's hidden reasoning, not the answer.
      const text = (candidate?.content?.parts ?? [])
        .filter((p) => !p.thought && p.text)
        .map((p) => p.text)
        .join('');

      if (!text && finishReason !== 'MAX_TOKENS') {
        throw new LlmError(`Gemini returned no text (finishReason: ${finishReason})`, {
          provider: name,
          retryable: finishReason !== 'SAFETY',
        });
      }

      const u = data.usageMetadata ?? {};
      return {
        text,
        finishReason,
        usage: {
          inputTokens: u.promptTokenCount ?? 0,
          outputTokens: u.candidatesTokenCount ?? 0,
          thinkingTokens: u.thoughtsTokenCount ?? 0,
          totalTokens: u.totalTokenCount ?? 0,
        },
      };
    },
  };
}
