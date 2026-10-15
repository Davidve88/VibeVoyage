import { useState } from 'preact/hooks';
import { THEMES, type Lang } from '../data/taxonomy';
import { toggleSaved, type ListState } from '../lib/list-store';

export interface PlaceData {
  id: string;
  name: string;
  themes: (keyof typeof THEMES)[];
  coords: [number, number];
  cost: string;
  time: string;
  text: string;
  tip?: string;
  how?: string;
  good?: string[];
  nearby: { id: string; name: string; min: number; uphill: boolean }[];
  links: { type: 'map' | 'tix' | 'web'; url: string; label?: string }[];
  query: string;
  photo?: { src: string; author: string; license: string; sourceUrl: string };
}

// Plain strings only (islands receive serialisable props).
export type Strings = Record<string, string>;

interface CardProps {
  p: PlaceData;
  lang: Lang;
  t: Strings;
  list: ListState;
  goTo: (id: string) => void;
}

function Card({ p, lang, t, list, goTo }: CardProps) {
  const [open, setOpen] = useState(false);
  const gid = `good-${p.id}`;
  const hasMore = (p.good && p.good.length > 0) || p.nearby.length > 0;
  const saved = list.saved.includes(p.id);
  return (
    <article class="card" id={`place-${p.id}`} tabIndex={-1}>
      {p.photo && <img src={p.photo.src} alt="" loading="lazy" />}
      <h3>{p.name}</h3>
      <p class="meta">{p.themes.map((x) => THEMES[x][lang]).join(', ')}</p>
      <p class="badges"><span class="badge">{p.cost}</span> <span class="time">{t.time}: {p.time}</span></p>
      <p>{p.text}</p>
      {p.tip && <div class="tip">{p.tip}</div>}
      {p.how && <div class="tip"><strong>{t.how}:</strong> {p.how}</div>}
      {hasMore && (
        <>
          <button type="button" class="linkbtn more" aria-expanded={open} aria-controls={gid} onClick={() => setOpen(!open)}>
            {open ? t.less : t.more}
          </button>
          <div id={gid} hidden={!open}>
            {p.good && p.good.length > 0 && (
              <ul class="good">
                {p.good.map((g) => <li>{g}</li>)}
              </ul>
            )}
            {p.nearby.length > 0 && (
              <div class="nearby">
                <h4>{t.nearby}</h4>
                <ul>
                  {p.nearby.map((n) => (
                    <li>
                      <button type="button" class="linkbtn" onClick={() => goTo(n.id)}>{n.name}</button>
                      <span class="time"> · {n.min} {t.walk}{n.uphill ? `, ${t.uphill}` : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
      {p.photo && (
        <p class="credit">{t.photoBy}: <a href={p.photo.sourceUrl}>{p.photo.author}</a>, {p.photo.license}</p>
      )}
      <div class="links">
        <button type="button" class={`btn save${saved ? ' on' : ''}`} aria-pressed={saved} onClick={() => toggleSaved(p.id)}>
          {saved ? t.inList : t.add}
        </button>
        {p.links.some((x) => x.type === 'map') ? null : (
          <a class="btn" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.query)}`}>{t.map}</a>
        )}
        {p.links.map((x) => (
          <a class="btn" target="_blank" rel="noopener" href={x.url}>{x.label ?? t[x.type]}</a>
        ))}
      </div>
    </article>
  );
}

interface Props {
  places: PlaceData[];
  lang: Lang;
  t: Strings;
  list: ListState;
  goTo: (id: string) => void;
}

export default function PlaceCards({ places, lang, t, list, goTo }: Props) {
  return (
    <>
      {places.length === 0 && <p>{t.none}</p>}
      <div class="grid">
        {places.map((p) => <Card key={p.id} p={p} lang={lang} t={t} list={list} goTo={goTo} />)}
      </div>
    </>
  );
}
