import { useCallback, useEffect, useState } from 'react';
import type { CaseBriefing, CharacterSummary, Verdict } from '@mystery/shared';
import { api } from './api/client';
import { Accuse } from './components/Accuse';
import { Briefing } from './components/Briefing';
import { CaseFile, type CaseFileTab } from './components/CaseFile';
import { Chat } from './components/Chat';
import { Scene } from './components/Scene';
import { SuspectPicker } from './components/SuspectPicker';
import { VerdictScreen } from './components/VerdictScreen';
import { getSessionId, hasReadBriefing, markBriefingRead, startNewSession } from './session';

type Screen =
  | { name: 'briefing' }
  | { name: 'picker' }
  | { name: 'scene' }
  | { name: 'accuse' }
  | { name: 'chat'; characterId: string };

export function App() {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [screen, setScreen] = useState<Screen>(() =>
    hasReadBriefing(sessionId) ? { name: 'picker' } : { name: 'briefing' },
  );
  const [briefing, setBriefing] = useState<CaseBriefing | null>(null);
  const [characters, setCharacters] = useState<CharacterSummary[] | null>(null);
  /** The verdict and the game it belongs to. null verdict = no accusation yet. */
  const [loaded, setLoaded] = useState<{ sessionId: string; verdict: Verdict | null } | null>(null);
  /** undefined while this game's verdict loads. Once set, the game is over. */
  const verdict = loaded?.sessionId === sessionId ? loaded.verdict : undefined;
  const setVerdict = (v: Verdict) => setLoaded({ sessionId, verdict: v });
  const [error, setError] = useState<string | null>(null);
  const [caseFile, setCaseFile] = useState<{ open: boolean; tab: CaseFileTab }>({
    open: false,
    tab: 'notes',
  });
  /** Bumped after each search so the evidence board reloads. */
  const [foundVersion, setFoundVersion] = useState(0);
  const openCaseFile = useCallback(
    (tab?: CaseFileTab) => setCaseFile((c) => ({ open: true, tab: tab ?? c.tab })),
    [],
  );
  const closeCaseFile = useCallback(() => setCaseFile((c) => ({ ...c, open: false })), []);

  useEffect(() => {
    Promise.all([api.briefing(), api.characters()])
      .then(([b, c]) => {
        setBriefing(b);
        setCharacters(c);
      })
      .catch(() => setError('Cannot reach the server. Is it running?'));
  }, []);

  // A reload after accusing goes straight back to the verdict.
  useEffect(() => {
    let cancelled = false;
    api
      .accusation(sessionId)
      .then((a) => !cancelled && setLoaded({ sessionId, verdict: a.verdict }))
      .catch(() => !cancelled && setError('Cannot reach the server. Is it running?'));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (briefing) document.title = briefing.title;
  }, [briefing]);

  function newGame(ask = true) {
    if (ask && !confirm('Start a new game? Every suspect will forget your conversations.')) return;
    setSessionId(startNewSession());
    setScreen({ name: 'briefing' });
    closeCaseFile();
    window.scrollTo(0, 0);
  }

  function begin() {
    markBriefingRead(sessionId);
    setScreen({ name: 'picker' });
  }

  const toPicker = () => setScreen({ name: 'picker' });

  if (error) return <p className="status">{error}</p>;
  if (!briefing || !characters || verdict === undefined) {
    return <p className="status">Boarding the train…</p>;
  }

  // The case file sits beside every screen except the opening briefing.
  const showCaseFile = verdict !== null || screen.name !== 'briefing';
  return (
    <>
      {renderScreen()}
      {showCaseFile && (
        <CaseFile
          key={sessionId}
          sessionId={sessionId}
          open={caseFile.open}
          tab={caseFile.tab}
          onOpen={openCaseFile}
          onClose={closeCaseFile}
          foundVersion={foundVersion}
        />
      )}
    </>
  );

  function renderScreen() {
    if (!briefing || !characters) return null; // narrowed above; repeated for the closure
    if (verdict) return <VerdictScreen verdict={verdict} onNewGame={() => newGame(false)} />;
    if (screen.name === 'briefing') return <Briefing briefing={briefing} onBegin={begin} />;
    if (screen.name === 'scene') {
      return (
        <Scene
          sessionId={sessionId}
          onBack={toPicker}
          onSearched={() => setFoundVersion((v) => v + 1)}
        />
      );
    }
    if (screen.name === 'accuse') {
      return (
        <Accuse
          sessionId={sessionId}
          suspects={characters.filter((c) => c.type === 'suspect')}
          onBack={toPicker}
          onVerdict={(v) => {
            setVerdict(v);
            window.scrollTo(0, 0);
          }}
        />
      );
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
          onBack={toPicker}
        />
      );
    }

    return (
      <SuspectPicker
        characters={characters}
        sessionId={sessionId}
        onPick={(characterId) => setScreen({ name: 'chat', characterId })}
        onSearch={() => setScreen({ name: 'scene' })}
        onAccuse={() => setScreen({ name: 'accuse' })}
        onBriefing={() => setScreen({ name: 'briefing' })}
        onNewGame={() => newGame()}
      />
    );
  }
}
