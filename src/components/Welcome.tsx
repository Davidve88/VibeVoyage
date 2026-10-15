import { useEffect, useState } from 'preact/hooks';

interface Props { h: string; b: string; noemiH: string; noemiB: string; sig: string; ok: string; close: string }

export default function Welcome(p: Props) {
  const [state, setState] = useState<'hidden' | 'generic' | 'noemi'>('hidden');
  useEffect(() => {
    const noemi = new URLSearchParams(location.search).get('for') === 'noemi';
    let dismissed = false;
    try { dismissed = localStorage.getItem('vv-welcome') === '1'; } catch {}
    if (!dismissed) setState(noemi ? 'noemi' : 'generic');
  }, []);
  if (state === 'hidden') return null;
  const close = () => {
    setState('hidden');
    try { localStorage.setItem('vv-welcome', '1'); } catch {}
  };
  return (
    <section class="wel">
      <button type="button" class="x" aria-label={p.close} onClick={close}>×</button>
      <h2>{state === 'noemi' ? p.noemiH : p.h}</h2>
      <p>{state === 'noemi' ? p.noemiB : p.b}</p>
      <p class="sig">{p.sig}</p>
      <button type="button" onClick={close}>{p.ok}</button>
    </section>
  );
}
