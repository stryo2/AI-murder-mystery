import { useEffect, useState } from 'react';
import type { EvidenceView, SceneItemView, SceneResponse } from '@mystery/shared';
import { api } from '../api/client';

interface SceneProps {
  sessionId: string;
  onBack: () => void;
}

/** Every searchable spot on the train, grouped by place. Searching one reveals its evidence. */
export function Scene({ sessionId, onBack }: SceneProps) {
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [searching, setSearching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .scene(sessionId)
      .then((s) => !cancelled && setScene(s))
      .catch((err: Error) => !cancelled && setError(`Could not load the train: ${err.message}`));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function search(itemId: string) {
    setError(null);
    setSearching(itemId);
    try {
      const found = await api.search({ sessionId, itemId });
      setScene((s) => s && replaceItem(s, found));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSearching(null);
    }
  }

  const foundCount =
    scene?.locations.flatMap((l) => l.items).reduce((n, i) => n + i.evidence.length, 0) ?? 0;

  return (
    <section className="scene">
      <header className="picker-header">
        <div>
          <h1>Search the train</h1>
          <p>
            {foundCount === 0
              ? 'Nothing found yet. Choose somewhere to search.'
              : `${foundCount} piece${foundCount === 1 ? '' : 's'} of evidence found.`}
          </p>
        </div>
        <button type="button" className="secondary" onClick={onBack}>
          ← All suspects
        </button>
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!scene && !error && <p className="status">Walking the corridor…</p>}

      {scene?.locations.map((place) => (
        <div key={place.id} className="place">
          <h2>{place.name}</h2>
          <ul className="scene-items">
            {place.items.map((item) => (
              <li key={item.id}>
                <SceneItemRow
                  item={item}
                  searching={searching === item.id}
                  disabled={searching !== null}
                  onSearch={() => void search(item.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

interface SceneItemRowProps {
  item: SceneItemView;
  searching: boolean;
  disabled: boolean;
  onSearch: () => void;
}

function SceneItemRow({ item, searching, disabled, onSearch }: SceneItemRowProps) {
  if (!item.searched) {
    return (
      <button type="button" className="scene-item" onClick={onSearch} disabled={disabled}>
        <span>{item.name}</span>
        <span className="card-count">{searching ? 'Searching…' : 'Search'}</span>
      </button>
    );
  }
  return (
    <div className="scene-item searched">
      <span>{item.name}</span>
      {item.evidence.map((e) => (
        <EvidenceCard key={e.id} evidence={e} />
      ))}
    </div>
  );
}

function EvidenceCard({ evidence }: { evidence: EvidenceView }) {
  return (
    <article className="evidence">
      <h3>{evidence.name}</h3>
      <p className="evidence-where">Found in: {evidence.foundIn}</p>
      <ul>
        {evidence.contents.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

function replaceItem(scene: SceneResponse, item: SceneItemView): SceneResponse {
  return {
    locations: scene.locations.map((l) => ({
      ...l,
      items: l.items.map((i) => (i.id === item.id ? item : i)),
    })),
  };
}
