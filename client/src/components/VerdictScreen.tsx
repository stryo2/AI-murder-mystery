import type { Verdict } from '@mystery/shared';

interface VerdictScreenProps {
  verdict: Verdict;
  onNewGame: () => void;
}

const STAMP: Record<Verdict['outcome'], string> = {
  win: 'Case closed',
  partial: 'Not proven',
  wrong: 'Wrong suspect',
};

/** The end of the game: the outcome, then what really happened. */
export function VerdictScreen({ verdict, onNewGame }: VerdictScreenProps) {
  return (
    <section className={`verdict ${verdict.outcome}`}>
      <p className="eyebrow">You accused {verdict.accusedName}</p>
      <p className="stamp" role="status">
        {STAMP[verdict.outcome]}
      </p>
      <h1>{verdict.headline}</h1>

      {verdict.missing.length > 0 && (
        <div className="briefing-note">
          <h2>What your case was missing</h2>
          <ul>
            {verdict.missing.map((m) => (
              <li key={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="verdict-heading">What really happened</h2>
      <p className="synopsis">{verdict.truth.finalAnswer}</p>
      <ol className="deduction">
        {verdict.truth.deduction.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2 className="verdict-heading">The others</h2>
      <ul className="cleared">
        {verdict.cleared.map((c) => (
          <li key={c.name}>
            <span className="card-name">{c.name}</span>
            <p>{c.reason}</p>
          </li>
        ))}
      </ul>

      <button type="button" className="begin" onClick={onNewGame}>
        Play again
      </button>
    </section>
  );
}
