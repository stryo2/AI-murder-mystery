import { useEffect, useState } from 'react';
import type { CharacterSummary } from '@mystery/shared';
import { api } from './api/client';
import { Chat } from './components/Chat';
import { getSessionId, startNewSession } from './session';

// Week 1: one suspect. Pick another for testing with ?suspect=hale.
// Week 2 replaces this with suspect picker cards.
const DEFAULT_SUSPECT = 'daniel';

export function App() {
  const [character, setCharacter] = useState<CharacterSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(getSessionId);

  function newGame() {
    if (confirm('Start a new game? Every suspect will forget this conversation.')) {
      setSessionId(startNewSession());
    }
  }

  useEffect(() => {
    const wanted = new URLSearchParams(location.search).get('suspect') ?? DEFAULT_SUSPECT;
    api
      .characters()
      .then((all) => {
        const found = all.find((c) => c.id === wanted);
        if (found) setCharacter(found);
        else setError(`No one called "${wanted}" is aboard.`);
      })
      .catch(() => setError('Cannot reach the server. Is it running?'));
  }, []);

  if (error) return <p className="status">{error}</p>;
  if (!character) return <p className="status">Boarding the train…</p>;
  // key: a new session remounts the chat, clearing what is on screen.
  return <Chat key={sessionId} character={character} sessionId={sessionId} onNewGame={newGame} />;
}
