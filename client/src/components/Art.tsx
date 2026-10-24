// Small image helpers. Both are decorative: the text next to them carries the meaning.
import type { CSSProperties } from 'react';

/** A one-colour icon, tinted by CSS (the SVG is used as a mask). */
export function Icon({ src }: { src: string }) {
  return (
    <span
      className="icon"
      aria-hidden="true"
      style={{ '--icon': `url("${src}")` } as CSSProperties}
    />
  );
}

/** A character's silhouette portrait, or nothing if they have none. */
export function Portrait({ src, size }: { src?: string; size: 'large' | 'small' }) {
  if (!src) return null;
  return <img className={`portrait ${size}`} src={src} alt="" />;
}
