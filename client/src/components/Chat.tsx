import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { CharacterSummary, ConversationMessage } from '@mystery/shared';
import { api } from '../api/client';

interface Message extends ConversationMessage {
  id: number;
}

const MAX_QUESTION_LENGTH = 1000; // matches the server's limit

interface ChatProps {
  character: CharacterSummary;
  sessionId: string;
  onNewGame: () => void;
}

export function Chat({ character, sessionId, onNewGame }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<{ text: string; question: string } | null>(null);
  const nextId = useRef(1);
  const listEnd = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  // Load the conversation so far, so the screen matches what the suspect remembers.
  useEffect(() => {
    let cancelled = false;
    api
      .history(sessionId, character.id)
      .then((h) => {
        if (cancelled) return;
        setMessages(h.messages.map((m) => ({ ...m, id: nextId.current++ })));
      })
      .catch((err: Error) => {
        if (!cancelled)
          setError({ text: `Could not load the conversation: ${err.message}`, question: '' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, character.id]);

  // Keep the newest message in view.
  useEffect(() => {
    listEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, waiting, error]);

  const add = (from: Message['from'], text: string) =>
    setMessages((m) => [...m, { id: nextId.current++, from, text }]);

  async function ask(question: string, retry = false) {
    if (!retry) add('player', question);
    setError(null);
    setWaiting(true);
    try {
      const res = await api.interrogate({ sessionId, characterId: character.id, question });
      add('suspect', res.reply);
    } catch (err) {
      setError({ text: (err as Error).message, question });
    } finally {
      setWaiting(false);
      input.current?.focus();
    }
  }

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const question = draft.trim();
    if (!question || waiting || loading) return;
    setDraft('');
    void ask(question);
  }

  // Enter sends; Shift+Enter adds a new line.
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  const firstName = character.name.replace(/^(Dr|Mr|Mrs|Miss) /, '').split(' ')[0];

  return (
    <section className="chat">
      <header className="chat-header">
        <div>
          <h1>{character.name}</h1>
          <p>{character.role}</p>
        </div>
        <button type="button" className="secondary" onClick={onNewGame} disabled={waiting}>
          New game
        </button>
      </header>

      <div className="messages" aria-live="polite">
        {loading && <p className="empty">Recalling your conversation…</p>}
        {!loading && messages.length === 0 && (
          <p className="empty">{firstName} is ready to talk. Ask your first question, Inspector.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.from}`}>
            <span className="speaker">{m.from === 'player' ? 'You' : firstName}</span>
            <p>{m.text}</p>
          </div>
        ))}
        {waiting && (
          <div className="message suspect thinking">
            <span className="speaker">{firstName}</span>
            <p>…</p>
          </div>
        )}
        {error && (
          <div className="error" role="alert">
            <span>{error.text}</span>
            {error.question && (
              <button type="button" onClick={() => void ask(error.question, true)}>
                Try again
              </button>
            )}
          </div>
        )}
        <div ref={listEnd} />
      </div>

      <form className="composer" onSubmit={submit}>
        <textarea
          ref={input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Ask ${firstName} a question…`}
          maxLength={MAX_QUESTION_LENGTH}
          rows={2}
          autoFocus
        />
        <button type="submit" disabled={waiting || loading || !draft.trim()}>
          Ask
        </button>
      </form>
    </section>
  );
}
