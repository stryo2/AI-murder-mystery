import { useEffect, useRef } from 'react';
import type { CaseBriefing } from '@mystery/shared';

interface BriefingProps {
  briefing: CaseBriefing;
  onBegin: () => void;
}

/** The opening screen: what happened and who the player is. */
export function Briefing({ briefing, onBegin }: BriefingProps) {
  const begin = useRef<HTMLButtonElement>(null);

  // Focus the button for keyboard players, but don't scroll to it: on a phone that would
  // skip straight past the title and photo.
  useEffect(() => begin.current?.focus({ preventScroll: true }), []);

  return (
    <section className="briefing">
      <div className="briefing-hero">
        {briefing.coverImage && (
          <img className="photo" src={briefing.coverImage} alt="" aria-hidden="true" />
        )}
        <div className="briefing-title">
          <p className="eyebrow">Case file · {briefing.setting}</p>
          <h1>{briefing.title}</h1>
        </div>
      </div>

      <div className="briefing-body">
        <p className="synopsis">{briefing.synopsis}</p>

        <div className="briefing-note">
          <h2>Your role</h2>
          <p>{briefing.playerRole}</p>
          <p>{briefing.briefing}</p>
        </div>

        <button ref={begin} type="button" className="begin" onClick={onBegin}>
          Begin the investigation
        </button>

        <p className="credits">
          Photographs: Jack Delano (FSA/OWI), Maksym Kozlenko and others, public domain / CC0, via
          Wikimedia Commons. Icons: Lorc, Delapouite and Sbed, from{' '}
          <a href="https://game-icons.net" target="_blank" rel="noreferrer">
            game-icons.net
          </a>
          , CC BY 3.0.
        </p>
      </div>
    </section>
  );
}
