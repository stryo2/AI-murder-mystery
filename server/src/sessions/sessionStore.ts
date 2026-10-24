// In-memory game state, per session: conversation history per character, which scene items
// the player has searched, and the verdict once they accuse someone. Week 3 moves this into
// Postgres; until then a server restart forgets every game.

import type { Verdict } from '@mystery/shared';
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

/** Session ids are made by the client, so check them before using one as a key. */
export const SESSION_ID = /^[A-Za-z0-9-]{8,64}$/;

interface Session {
  lastUsed: number;
  conversations: Map<string, ChatMessage[]>;
  /** Scene item ids, in the order they were searched. */
  searchedItems: Set<string>;
  /** Set once the player accuses someone; the game is over after that. */
  verdict?: Verdict;
}

// A Map keeps insertion order; touching a session re-inserts it, so the first key is the oldest.
const sessions = new Map<string, Session>();
/** "session/character" pairs with a model call in flight, to stop overlapping questions. */
const busy = new Set<string>();

function touch(sessionId: string): Session {
  const now = Date.now();
  let session = sessions.get(sessionId);
  if (session && now - session.lastUsed > SESSION_TTL_MS) session = undefined;
  session ??= { lastUsed: now, conversations: new Map(), searchedItems: new Set() };
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

export function getSearchedItems(sessionId: string): Set<string> {
  return new Set(touch(sessionId).searchedItems);
}

export function markSearched(sessionId: string, itemId: string) {
  touch(sessionId).searchedItems.add(itemId);
}

export function getVerdict(sessionId: string): Verdict | undefined {
  return touch(sessionId).verdict;
}

export function setVerdict(sessionId: string, verdict: Verdict) {
  touch(sessionId).verdict = verdict;
}
