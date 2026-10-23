import { useEffect, useState } from 'react';
import { api } from './api/client';

export function App() {
  const [status, setStatus] = useState('checking…');

  useEffect(() => {
    api
      .health()
      .then((h) => setStatus(`server ${h.status}`))
      .catch(() => setStatus('server unreachable'));
  }, []);

  return (
    <main>
      <h1>The Last Stop</h1>
      <p>{status}</p>
    </main>
  );
}
