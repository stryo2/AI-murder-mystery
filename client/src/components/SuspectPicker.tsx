import { useEffect, useState } from 'react';
import type { CharacterSummary } from '@mystery/shared';
import { api } from '../api/client';

interface SuspectPickerProps {
  characters: CharacterSummary[];
  sessionId: string;
  onPick: (characterId: string) => void;
  onBriefing: () => void;
  onNewGame: () => void;
}

/** Cards for the four suspects, plus a smaller row for the witnesses. */
export function SuspectPicker({
  characters,
  sessionId,
  onPick,
  onBriefing,
  onNewGame,
}: SuspectPickerProps) {
  const questionCounts = useQuestionCounts(characters, sessionId);
  const suspects = characters.filter((c) => c.type === 'suspect');
  const witnesses = characters.filter((c) => c.type === 'witness');

  return (
    <section className="picker">
      <header className="picker-header">
        <div>
          <h1>Who will you question?</h1>
          <p>You can return to anyone at any time. They remember what you asked.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary" onClick={onBriefing}>
            Briefing
          </button>
          <button type="button" className="secondary" onClick={onNewGame}>
            New game
          </button>
        </div>
      </header>

      <ul className="suspect-grid">
        {suspects.map((c) => (
          <li key={c.id}>
            <button type="button" className="suspect-card" onClick={() => onPick(c.id)}>
              <span className="card-name">{c.name}</span>
              <span className="card-role">
                {c.role}
                {c.age !== null && `, ${c.age}`}
              </span>
              {c.statement && <q className="card-statement">{c.statement}</q>}
              <CountLabel count={questionCounts[c.id]} />
            </button>
          </li>
        ))}
      </ul>

      {witnesses.length > 0 && (
        <>
          <h2 className="witness-heading">Also aboard</h2>
          <ul className="witness-list">
            {witnesses.map((c) => (
              <li key={c.id}>
                <button type="button" className="witness-card" onClick={() => onPick(c.id)}>
                  <span className="card-name">{c.name}</span>
                  <span className="card-role">{c.role}</span>
                  <CountLabel count={questionCounts[c.id]} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function CountLabel({ count }: { count: number | undefined }) {
  if (count === undefined) return null; // still loading, or the history call failed
  return (
    <span className="card-count">
      {count === 0 ? 'Not yet questioned' : `${count} question${count === 1 ? '' : 's'} asked`}
    </span>
  );
}

/** How many questions the player has asked each character in this game. */
function useQuestionCounts(characters: CharacterSummary[], sessionId: string) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    for (const c of characters) {
      api
        .history(sessionId, c.id)
        .then((h) => {
          if (cancelled) return;
          const asked = h.messages.filter((m) => m.from === 'player').length;
          setCounts((prev) => ({ ...prev, [c.id]: asked }));
        })
        .catch(() => {
          // the count is a nicety; the card still works without it
        });
    }
    return () => {
      cancelled = true;
    };
  }, [characters, sessionId]);

  return counts;
}
