import { useEffect, useState } from 'react';
import type { CaseBriefing, CharacterSummary } from '@mystery/shared';
import { api } from './api/client';
import { Briefing } from './components/Briefing';
import { Chat } from './components/Chat';
import { Scene } from './components/Scene';
import { SuspectPicker } from './components/SuspectPicker';
import { getSessionId, hasReadBriefing, markBriefingRead, startNewSession } from './session';

type Screen =
  | { name: 'briefing' }
  | { name: 'picker' }
  | { name: 'scene' }
  | { name: 'chat'; characterId: string };

export function App() {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [screen, setScreen] = useState<Screen>(() =>
    hasReadBriefing(sessionId) ? { name: 'picker' } : { name: 'briefing' },
  );
  const [briefing, setBriefing] = useState<CaseBriefing | null>(null);
  const [characters, setCharacters] = useState<CharacterSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.briefing(), api.characters()])
      .then(([b, c]) => {
        setBriefing(b);
        setCharacters(c);
      })
      .catch(() => setError('Cannot reach the server. Is it running?'));
  }, []);

  useEffect(() => {
    if (briefing) document.title = briefing.title;
  }, [briefing]);

  function newGame() {
    if (confirm('Start a new game? Every suspect will forget your conversations.')) {
      setSessionId(startNewSession());
      setScreen({ name: 'briefing' });
    }
  }

  function begin() {
    markBriefingRead(sessionId);
    setScreen({ name: 'picker' });
  }

  if (error) return <p className="status">{error}</p>;
  if (!briefing || !characters) return <p className="status">Boarding the train…</p>;

  if (screen.name === 'briefing') return <Briefing briefing={briefing} onBegin={begin} />;
  if (screen.name === 'scene') {
    return <Scene sessionId={sessionId} onBack={() => setScreen({ name: 'picker' })} />;
  }

  const chatWith =
    screen.name === 'chat' ? characters.find((c) => c.id === screen.characterId) : undefined;
  if (chatWith) {
    // key: a new character or session remounts the chat, clearing what is on screen.
    return (
      <Chat
        key={`${sessionId}/${chatWith.id}`}
        character={chatWith}
        sessionId={sessionId}
        onBack={() => setScreen({ name: 'picker' })}
      />
    );
  }

  return (
    <SuspectPicker
      characters={characters}
      sessionId={sessionId}
      onPick={(characterId) => setScreen({ name: 'chat', characterId })}
      onSearch={() => setScreen({ name: 'scene' })}
      onBriefing={() => setScreen({ name: 'briefing' })}
      onNewGame={newGame}
    />
  );
}
