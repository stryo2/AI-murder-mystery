import type { CaseBriefing } from '@mystery/shared';

interface BriefingProps {
  briefing: CaseBriefing;
  onBegin: () => void;
}

/** The opening screen: what happened and who the player is. */
export function Briefing({ briefing, onBegin }: BriefingProps) {
  return (
    <section className="briefing">
      <p className="eyebrow">{briefing.setting}</p>
      <h1>{briefing.title}</h1>
      <p className="synopsis">{briefing.synopsis}</p>

      <div className="briefing-note">
        <h2>Your role</h2>
        <p>{briefing.playerRole}</p>
        <p>{briefing.briefing}</p>
      </div>

      <button type="button" className="begin" onClick={onBegin} autoFocus>
        Begin the investigation
      </button>
    </section>
  );
}
