// Every model call (success or failure) is appended as one JSON line to logs/llm-calls.jsonl,
// relative to where the server runs (server/ when started with npm). The folder is gitignored.
// One line per call keeps it easy to grep, or load into a script for eval reports later.

import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { ChatMessage, TokenUsage } from './types';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'llm-calls.jsonl');

export interface LlmLogEntry {
  time: string;
  tag?: string;
  provider: string;
  model: string;
  ok: boolean;
  latencyMs: number;
  attempts: number;
  system?: string;
  messages: ChatMessage[];
  response?: string;
  finishReason?: string;
  usage?: TokenUsage;
  error?: string;
}

let dirReady: Promise<unknown> | undefined;

export async function logLlmCall(entry: LlmLogEntry): Promise<void> {
  const tokens = entry.usage ? ` ${entry.usage.inputTokens}→${entry.usage.outputTokens} tok` : '';
  const status = entry.ok ? 'ok' : `FAILED: ${entry.error}`;
  console.log(
    `[llm] ${entry.tag ?? '-'} ${entry.model} ${entry.latencyMs}ms x${entry.attempts}${tokens} ${status}`,
  );

  // Logging must never break a game, so file errors are reported and swallowed.
  try {
    dirReady ??= mkdir(LOG_DIR, { recursive: true });
    await dirReady;
    await appendFile(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    console.error('[llm] could not write log file:', err);
  }
}
