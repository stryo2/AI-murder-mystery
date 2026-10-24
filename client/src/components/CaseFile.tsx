import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { EvidenceView } from '@mystery/shared';
import { api } from '../api/client';
import { Icon } from './Art';

export type CaseFileTab = 'notes' | 'evidence';

interface CaseFileProps {
  sessionId: string;
  open: boolean;
  tab: CaseFileTab;
  onOpen: (tab?: CaseFileTab) => void;
  onClose: () => void;
  /** Changes whenever the player finds something, so the board reloads. */
  foundVersion: number;
}

const MAX_NOTES_LENGTH = 20_000; // matches the server's limit

/**
 * The case file: a side panel with the player's notebook and an evidence board.
 * It stays mounted while closed (just slid away and inert), so notes are never lost mid-save.
 */
export function CaseFile({ sessionId, open, tab, onOpen, onClose, foundVersion }: CaseFileProps) {
  const notes = useNotes(sessionId);
  const notesBox = useRef<HTMLTextAreaElement>(null);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // On wide screens the page makes room for the panel instead of hiding under it.
  useEffect(() => {
    document.body.classList.toggle('case-file-open', open);
    return () => document.body.classList.remove('case-file-open');
  }, [open]);

  function addToNotes(e: EvidenceView) {
    const line = `Exhibit ${e.id} (${e.name}): `;
    const current = notes.text ?? '';
    const next = current.trim() ? `${current.trimEnd()}\n\n${line}` : line;
    notes.update(next.slice(0, MAX_NOTES_LENGTH));
    onOpen('notes');
    // Put the cursor at the end, ready to type.
    requestAnimationFrame(() => {
      const box = notesBox.current;
      if (!box) return;
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
      box.scrollTop = box.scrollHeight;
    });
  }

  return (
    <>
      {!open && (
        <button type="button" className="case-file-tab" onClick={() => onOpen()}>
          Case file
        </button>
      )}
      <aside className={`case-file${open ? ' open' : ''}`} aria-label="Case file" inert={!open}>
        <header className="case-file-header">
          <div className="case-file-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'notes'}
              onClick={() => onOpen('notes')}
            >
              Notebook
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'evidence'}
              onClick={() => onOpen('evidence')}
            >
              Evidence
            </button>
          </div>
          <button
            type="button"
            className="secondary"
            onClick={onClose}
            aria-label="Close case file"
          >
            ✕
          </button>
        </header>

        <div className="case-file-body" role="tabpanel">
          {tab === 'notes' ? (
            <Notebook notes={notes} box={notesBox} />
          ) : (
            <EvidenceBoard
              sessionId={sessionId}
              active={open}
              foundVersion={foundVersion}
              onAddToNotes={addToNotes}
            />
          )}
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------------------------

type SaveStatus = 'saved' | 'saving' | 'error';

/**
 * The notes text plus autosave. Saves shortly after the player stops typing, one request at a
 * time: if they type during a save, another save follows, so an old save can never land last.
 */
function useNotes(sessionId: string) {
  const [text, setText] = useState<string | null>(null); // null while loading
  const [status, setStatus] = useState<SaveStatus>('saved');
  const latest = useRef('');
  const saved = useRef('');
  const saving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    if (saving.current) return; // the save already running loops until it has caught up
    saving.current = true;
    try {
      while (latest.current !== saved.current) {
        setStatus('saving');
        const sending = latest.current;
        await api.saveNotes({ sessionId, text: sending });
        saved.current = sending;
      }
      setStatus('saved');
    } catch {
      setStatus('error');
    } finally {
      saving.current = false;
    }
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;
    api
      .notes(sessionId)
      .then((n) => {
        if (cancelled) return;
        latest.current = saved.current = n.text;
        setText(n.text);
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
      void flush(); // don't drop the last few keystrokes
    };
  }, [sessionId, flush]);

  const update = useCallback(
    (next: string) => {
      latest.current = next;
      setText(next);
      setStatus('saving');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 700);
    },
    [flush],
  );

  return { text, status, update, retry: flush };
}

type Notes = ReturnType<typeof useNotes>;

function Notebook({ notes, box }: { notes: Notes; box: RefObject<HTMLTextAreaElement | null> }) {
  if (notes.text === null) {
    return (
      <p className="status">
        {notes.status === 'error' ? 'Could not open your notebook.' : 'Opening your notebook…'}
      </p>
    );
  }
  return (
    <div className="notebook">
      <textarea
        ref={box}
        value={notes.text}
        onChange={(e) => notes.update(e.target.value)}
        maxLength={MAX_NOTES_LENGTH}
        placeholder="Times, lies, hunches. Anything you want to remember."
        aria-label="Your notes"
        spellCheck
      />
      <p className="save-status" aria-live="polite">
        {notes.status === 'saved' && 'Saved'}
        {notes.status === 'saving' && 'Saving…'}
        {notes.status === 'error' && (
          <>
            Not saved.{' '}
            <button type="button" className="link" onClick={() => void notes.retry()}>
              Try again
            </button>
          </>
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

interface EvidenceBoardProps {
  sessionId: string;
  active: boolean;
  foundVersion: number;
  onAddToNotes: (e: EvidenceView) => void;
}

/** Everything found so far, pinned up. Click a card to read it in full. */
function EvidenceBoard({ sessionId, active, foundVersion, onAddToNotes }: EvidenceBoardProps) {
  const [found, setFound] = useState<EvidenceView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    api
      .scene(sessionId)
      .then((s) => {
        if (cancelled) return;
        setFound(s.locations.flatMap((l) => l.items.flatMap((i) => i.evidence)));
        setError(null);
      })
      .catch((err: Error) => !cancelled && setError(`Could not load the board: ${err.message}`));
    return () => {
      cancelled = true;
    };
  }, [sessionId, active, foundVersion]);

  if (error) return <p className="error">{error}</p>;
  if (!found) return <p className="status">Pinning up the evidence…</p>;
  if (!found.length) {
    return <p className="status">Nothing on the board yet. Search the train to find evidence.</p>;
  }

  const open = found.find((e) => e.id === selected);
  if (open) {
    return (
      <article className="board-detail">
        <button type="button" className="secondary" onClick={() => setSelected(null)}>
          ← The board
        </button>
        <div className="evidence">
          {open.icon && <Icon src={open.icon} />}
          <div>
            <p className="evidence-tag">Exhibit {open.id}</p>
            <h3>{open.name}</h3>
            <p className="evidence-where">Found in: {open.foundIn}</p>
            <ul>
              {open.contents.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
        <button type="button" onClick={() => onAddToNotes(open)}>
          Add to notes
        </button>
      </article>
    );
  }

  return (
    <ul className="board">
      {found.map((e) => (
        <li key={e.id}>
          <button type="button" className="pinned" onClick={() => setSelected(e.id)}>
            {e.icon && <Icon src={e.icon} />}
            <span className="evidence-tag">Exhibit {e.id}</span>
            <span className="pinned-name">{e.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
