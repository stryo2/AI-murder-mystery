// callModel(): the one function the rest of the server uses to talk to an LLM.
// Adds a per-attempt timeout, retries with backoff, and logs every call.
// Pass onText to stream the reply piece by piece.

import { env } from '../config/env';
import { logLlmCall } from './logger';
import { createGeminiProvider } from './providers/gemini';
import { LlmError, type CallModelOptions, type LlmProvider, type ModelResult } from './types';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;
const BASE_BACKOFF_MS = 1_000;
/** If the provider says "wait longer than this" (e.g. daily quota used up), fail instead of hanging. */
const MAX_WAIT_MS = 20_000;

function createProvider(): LlmProvider {
  switch (env.LLM_PROVIDER) {
    case 'gemini':
      return createGeminiProvider(env.LLM_API_KEY);
    default:
      throw new Error(`Unknown LLM_PROVIDER "${env.LLM_PROVIDER}" (supported: gemini)`);
  }
}

let provider: LlmProvider | undefined;

export async function callModel(opts: CallModelOptions): Promise<ModelResult> {
  provider ??= createProvider();
  const model = opts.model || env.LLM_MODEL;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;
  const start = Date.now();
  let attempts = 0;
  let firstTextMs: number | undefined;
  // Once any text has reached the caller, a retry would show the player a second, different
  // answer, so a stream that fails part-way is not retried.
  let sentText = false;
  const onText =
    opts.onText &&
    ((piece: string) => {
      if (!sentText) firstTextMs = Date.now() - start;
      sentText = true;
      opts.onText!(piece);
    });

  const log = (fields: { ok: boolean; result?: ModelResult; error?: string }) =>
    logLlmCall({
      time: new Date(start).toISOString(),
      tag: opts.tag,
      provider: provider!.name,
      model,
      ok: fields.ok,
      latencyMs: Date.now() - start,
      attempts,
      system: opts.system,
      messages: opts.messages,
      response: fields.result?.text,
      finishReason: fields.result?.finishReason,
      usage: fields.result?.usage,
      streamed: Boolean(onText),
      firstTextMs,
      error: fields.error,
    });

  try {
    if (!model) {
      throw new LlmError('No model given and LLM_MODEL is not set in server/.env', {
        provider: provider.name,
        retryable: false,
      });
    }

    for (;;) {
      attempts++;
      const timeout = AbortSignal.timeout(timeoutMs);
      const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;

      try {
        const req = {
          model,
          system: opts.system,
          messages: opts.messages,
          temperature: opts.temperature,
          maxOutputTokens: opts.maxOutputTokens,
          json: opts.json,
        };
        const res = onText
          ? await provider.generateStream(req, signal, onText)
          : await provider.generate(req, signal);
        const result: ModelResult = {
          ...res,
          provider: provider.name,
          model,
          latencyMs: Date.now() - start,
          attempts,
          firstTextMs,
        };
        await log({ ok: true, result });
        return result;
      } catch (rawErr) {
        if (opts.signal?.aborted) throw rawErr; // caller cancelled: stop, don't retry
        const err = timeout.aborted
          ? new LlmError(`Timed out after ${timeoutMs}ms`, {
              provider: provider.name,
              retryable: true,
            })
          : rawErr;

        if (!(err instanceof LlmError) || !err.opts.retryable || attempts > maxRetries) throw err;
        if (sentText) throw err;

        // Exponential backoff with jitter: ~1s, ~2s, ~4s... or the server's own hint.
        const backoff = BASE_BACKOFF_MS * 2 ** (attempts - 1) * (0.5 + Math.random());
        const waitMs = err.opts.retryAfterMs ?? backoff;
        if (waitMs > MAX_WAIT_MS) throw err;

        console.warn(
          `[llm] attempt ${attempts} failed (${err.message}); retrying in ${Math.round(waitMs)}ms`,
        );
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  } catch (err) {
    await log({ ok: false, error: (err as Error).message });
    throw err;
  }
}
