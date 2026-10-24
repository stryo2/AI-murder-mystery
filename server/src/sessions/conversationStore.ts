// In-memory conversation history, per game session and per character.
// Week 3 moves this into Postgres (sessions + messages tables); until then a server restart
// forgets every game.

import type { ChatMessage } from '../llm';

/** Idle games are dropped after this long. */
const SESSION_TTL_MS = 6 * 60 * 60 * 1000;
/** Hard cap so a flood of new sessions can't exhaust memory. Oldest are dropped first. */
const MAX_SESSIONS = 1000;
/**
 * Only the most recent messages go to the model. Week 5 replaces this cut-off with a summary
 * of older turns, so suspects don't forget what they said early on.
 */
export const MAX_MESSAGES_IN_PROMPT = 40;

interface Session {
  lastUsed: number;
  conversations: Map<string, ChatMessage[]>;
}

// A Map keeps insertion order; touching a session re-inserts it, so the first key is the oldest.
const sessions = new Map<string, Session>();
/** "session/character" pairs with a model call in flight, to stop overlapping questions. */
const busy = new Set<string>();

function touch(sessionId: string): Session {
  const now = Date.now();
  let session = sessions.get(sessionId);
  if (session && now - session.lastUsed > SESSION_TTL_MS) session = undefined;
  session ??= { lastUsed: now, conversations: new Map() };
  session.lastUsed = now;
  sessions.delete(sessionId);
  sessions.set(sessionId, session);
  prune(now);
  return session;
}

function prune(now: number) {
  for (const [id, s] of sessions) {
    if (sessions.size <= MAX_SESSIONS && now - s.lastUsed <= SESSION_TTL_MS) break;
    sessions.delete(id);
  }
}

export function getHistory(sessionId: string, characterId: string): ChatMessage[] {
  return [...(touch(sessionId).conversations.get(characterId) ?? [])];
}

/** Saves a question and its answer together, so a failed call never leaves half a turn. */
export function appendTurn(
  sessionId: string,
  characterId: string,
  question: string,
  reply: string,
) {
  const { conversations } = touch(sessionId);
  const history = conversations.get(characterId) ?? [];
  history.push({ role: 'user', content: question }, { role: 'assistant', content: reply });
  conversations.set(characterId, history);
}

/** Returns false if a question to this character is already being answered. */
export function tryLock(sessionId: string, characterId: string): boolean {
  const key = `${sessionId}/${characterId}`;
  if (busy.has(key)) return false;
  busy.add(key);
  return true;
}

export function unlock(sessionId: string, characterId: string) {
  busy.delete(`${sessionId}/${characterId}`);
}
