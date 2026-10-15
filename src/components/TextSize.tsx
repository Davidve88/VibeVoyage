import { useEffect, useState } from 'preact/hooks';

const SIZES = [
  { label: 'A', v: '1' },
  { label: 'A+', v: '1.2' },
  { label: 'A++', v: '1.4' },
];

export default function TextSize({ label }: { label: string }) {
  const [v, setV] = useState('1');
  useEffect(() => {
    try { setV(localStorage.getItem('vv-fs') || '1'); } catch {}
  }, []);
  const pick = (n: string) => {
    setV(n);
    document.documentElement.style.setProperty('--fs', n);
    try { localStorage.setItem('vv-fs', n); } catch {}
  };
  return (
    <div class="seg" role="group" aria-label={label}>
      {SIZES.map((s) => (
        <button type="button" class={v === s.v ? 'on' : ''} aria-pressed={v === s.v} onClick={() => pick(s.v)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}
