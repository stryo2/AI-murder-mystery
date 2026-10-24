// One session id per playthrough, kept in localStorage so a reload continues the same game.
// Storage can be blocked (private windows), so every access is guarded; without it the game
// still works, it just starts fresh on reload.

const KEY = 'last-stop-session';

function newId(): string {
  // randomUUID needs a secure context (https or localhost); fall back elsewhere.
  return (
    crypto.randomUUID?.() ?? `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  );
}

export function getSessionId(): string {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
  } catch {
    // storage blocked
  }
  return startNewSession();
}

export function startNewSession(): string {
  const id = newId();
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // storage blocked
  }
  return id;
}
