// Types for the LLM layer. Everything outside src/llm talks to models through these.

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface CallModelOptions {
  /** Conversation so far, oldest first. The last message is usually the player's question. */
  messages: ChatMessage[];
  /** System prompt (persona + knowledge slice). */
  system?: string;
  /** Model id. Defaults to LLM_MODEL from .env. */
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  /**
   * Ask for JSON output. `true` = any JSON; an object = a JSON schema the reply must follow
   * (used from Week 3 for `{ reply, claims }`).
   */
  json?: boolean | Record<string, unknown>;
  /** Per-attempt timeout. Default 30s. */
  timeoutMs?: number;
  /** Retries after the first attempt, for 429 / 5xx / network / timeout. Default 2. */
  maxRetries?: number;
  /** Short label for the logs, e.g. "interrogate:daniel". */
  tag?: string;
  /** Lets the caller cancel (e.g. the player closed the tab). Cancelled calls are not retried. */
  signal?: AbortSignal;
  /**
   * Stream the reply: called with each new piece of text as it arrives. The full text is
   * still returned at the end. Retries only happen before the first piece is sent.
   */
  onText?: (text: string) => void;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  /** Hidden reasoning tokens, for models that "think". Billed as output. */
  thinkingTokens: number;
  totalTokens: number;
}

export interface ModelResult {
  text: string;
  provider: string;
  model: string;
  usage: TokenUsage;
  /** Why the model stopped, as the provider reports it (e.g. "STOP", "MAX_TOKENS"). */
  finishReason: string;
  /** Wall time for the whole call, including retries. */
  latencyMs: number;
  /** 1 = succeeded first time. */
  attempts: number;
  /** Streaming only: time until the first text arrived, from the start of the call. */
  firstTextMs?: number;
}

/** What callModel hands a provider for one attempt. */
export interface ProviderRequest {
  model: string;
  system?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxOutputTokens?: number;
  json?: boolean | Record<string, unknown>;
}

export interface ProviderResponse {
  text: string;
  usage: TokenUsage;
  finishReason: string;
}

export interface LlmProvider {
  name: string;
  generate(req: ProviderRequest, signal: AbortSignal): Promise<ProviderResponse>;
  /** Like generate, but calls onText with each new piece of text as it arrives. */
  generateStream(
    req: ProviderRequest,
    signal: AbortSignal,
    onText: (text: string) => void,
  ): Promise<ProviderResponse>;
}

export class LlmError extends Error {
  constructor(
    message: string,
    readonly opts: {
      provider: string;
      /** HTTP status, if the provider answered. */
      status?: number;
      /** Whether trying again might work. */
      retryable: boolean;
      /** Server-suggested wait before retrying (from a 429). */
      retryAfterMs?: number;
    },
  ) {
    super(message);
    this.name = 'LlmError';
  }
}
