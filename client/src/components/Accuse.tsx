import { useEffect, useState, type FormEvent } from 'react';
import type { CharacterSummary, EvidenceView, Verdict } from '@mystery/shared';
import { api } from '../api/client';
import { Icon, Portrait } from './Art';

interface AccuseProps {
  sessionId: string;
  suspects: CharacterSummary[];
  onBack: () => void;
  onVerdict: (verdict: Verdict) => void;
}

/** The three things an accusation must show, each backed by one found exhibit. */
const QUESTIONS = [
  { key: 'motiveEvidenceId', title: 'Why did they do it?', hint: 'The motive' },
  { key: 'opportunityEvidenceId', title: 'When could they have done it?', hint: 'The opportunity' },
  { key: 'meansEvidenceId', title: 'What ties them to the crime?', hint: 'The physical link' },
] as const;

type QuestionKey = (typeof QUESTIONS)[number]['key'];
/** "" = not answered yet, "none" = "I can't show this", otherwise an evidence id. */
type Answers = Record<QuestionKey, string>;

const NONE = 'none';

/** Name the culprit and back it up with evidence. Final: one accusation per game. */
export function Accuse({ sessionId, suspects, onBack, onVerdict }: AccuseProps) {
  const [found, setFound] = useState<EvidenceView[] | null>(null);
  const [culpritId, setCulpritId] = useState('');
  const [answers, setAnswers] = useState<Answers>({
    motiveEvidenceId: '',
    opportunityEvidenceId: '',
    meansEvidenceId: '',
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The exhibits the player can point to: everything found so far.
  useEffect(() => {
    let cancelled = false;
    api
      .scene(sessionId)
      .then((s) => {
        if (cancelled) return;
        setFound(s.locations.flatMap((l) => l.items.flatMap((i) => i.evidence)));
      })
      .catch(
        (err: Error) => !cancelled && setError(`Could not load your evidence: ${err.message}`),
      );
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const complete = culpritId !== '' && QUESTIONS.every((q) => answers[q.key] !== '');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!complete || sending) return;
    const name = suspects.find((s) => s.id === culpritId)?.name ?? 'them';
    if (!confirm(`Accuse ${name}? This is final: the case ends with your accusation.`)) return;

    setSending(true);
    setError(null);
    const pick = (key: QuestionKey) => (answers[key] === NONE ? null : answers[key]);
    try {
      onVerdict(
        await api.accuse({
          sessionId,
          culpritId,
          motiveEvidenceId: pick('motiveEvidenceId'),
          opportunityEvidenceId: pick('opportunityEvidenceId'),
          meansEvidenceId: pick('meansEvidenceId'),
        }),
      );
    } catch (err) {
      setError((err as Error).message);
      setSending(false);
    }
  }

  return (
    <section className="accuse">
      <header className="picker-header">
        <div>
          <p className="eyebrow">The accusation</p>
          <h1>Name the killer</h1>
          <p>You get one accusation. Back it up with the evidence you have found.</p>
        </div>
        <button type="button" className="secondary" onClick={onBack} disabled={sending}>
          ← Not yet
        </button>
      </header>

      <form onSubmit={(e) => void submit(e)}>
        <fieldset className="accuse-step">
          <legend>
            <span className="step-number">1</span> Who did it?
          </legend>
          <div className="culprit-grid">
            {suspects.map((s) => (
              <label key={s.id} className="choice culprit-choice">
                <input
                  type="radio"
                  name="culprit"
                  value={s.id}
                  checked={culpritId === s.id}
                  onChange={() => setCulpritId(s.id)}
                />
                <Portrait src={s.portrait} size="large" />
                <span className="card-name">{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {QUESTIONS.map((q, n) => (
          <fieldset key={q.key} className="accuse-step">
            <legend>
              <span className="step-number">{n + 2}</span> {q.title}
              <span className="step-hint">{q.hint}</span>
            </legend>
            {found === null && !error && <p className="status">Gathering your evidence…</p>}
            <div className="exhibit-list">
              {found?.map((e) => (
                <label key={e.id} className="choice exhibit-choice">
                  <input
                    type="radio"
                    name={q.key}
                    value={e.id}
                    checked={answers[q.key] === e.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.key]: e.id }))}
                  />
                  {e.icon && <Icon src={e.icon} />}
                  <span>
                    <span className="evidence-tag">Exhibit {e.id}</span>
                    <span className="exhibit-name">{e.name}</span>
                  </span>
                </label>
              ))}
              <label className="choice exhibit-choice none">
                <input
                  type="radio"
                  name={q.key}
                  value={NONE}
                  checked={answers[q.key] === NONE}
                  onChange={() => setAnswers((a) => ({ ...a, [q.key]: NONE }))}
                />
                <span>I can’t show this</span>
              </label>
            </div>
          </fieldset>
        ))}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="accuse-button" disabled={!complete || sending}>
          {sending ? 'Making the accusation…' : 'Make the accusation'}
        </button>
        {!complete && <p className="accuse-help">Answer all four to make the accusation.</p>}
      </form>
    </section>
  );
}
