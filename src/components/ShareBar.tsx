import { useState } from 'preact/hooks';
import { encodeIds, type ListState } from '../lib/list-store';
import type { PlaceData, Strings } from './PlaceList';

interface Props {
  places: PlaceData[];
  t: Strings;
  list: ListState;
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function ShareBar({ places, t, list }: Props) {
  const [msg, setMsg] = useState('');
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2500);
  };

  // Saved ids only; visited stays private.
  const link = () => `${location.origin}${location.pathname}#shared=${encodeIds(list.saved)}`;

  const share = async () => {
    const url = link();
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: t.shareTitle, url });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return;
      }
    }
    flash((await copy(url)) ? t.copied : url);
  };

  const copyLink = async () => flash((await copy(link())) ? t.copied : link());

  const copyText = async () => {
    const byId = new Map(places.map((p) => [p.id, p.name]));
    const names = list.saved.map((id) => byId.get(id)).filter(Boolean);
    const text = [t.shareTitle, ...names.map((n) => `- ${n}`), '', link()].join('\n');
    flash((await copy(text)) ? t.copied : text);
  };

  return (
    <div class="sharebar">
      <button type="button" class="btn" onClick={share}>{t.share}</button>
      <button type="button" class="btn save" onClick={copyLink}>{t.copyLink}</button>
      <button type="button" class="btn save" onClick={copyText}>{t.copyText}</button>
      <span class="shmsg" role="status" aria-live="polite">{msg}</span>
    </div>
  );
}
