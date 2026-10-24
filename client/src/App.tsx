import { useEffect, useState } from 'react';
import type { CharacterSummary } from '@mystery/shared';
import { api } from './api/client';
import { Chat } from './components/Chat';

// Week 1: one suspect. Pick another for testing with ?suspect=hale.
// Week 2 replaces this with suspect picker cards.
const DEFAULT_SUSPECT = 'daniel';

export function App() {
  const [character, setCharacter] = useState<CharacterSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  return <Chat character={character} />;
}
