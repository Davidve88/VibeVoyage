import { useMemo, useState } from 'preact/hooks';
import { AREAS, THEMES, type Lang } from '../data/taxonomy';

export interface PlaceData {
  id: string;
  name: string;
  area: keyof typeof AREAS;
  themes: (keyof typeof THEMES)[];
  text: string;
  tip?: string;
  how?: string;
  links: { type: 'map' | 'tix' | 'web'; url: string; label?: string }[];
  query: string;
  photo?: { src: string; author: string; license: string; sourceUrl: string };
}

// Plain strings only (islands receive serialisable props).
export interface ListStrings {
  area: string; theme: string; clear: string; one: string; many: string; none: string;
  map: string; tix: string; web: string; how: string; photoBy: string;
}

interface Props { lang: Lang; places: PlaceData[]; t: ListStrings }

export default function PlaceList({ lang, places, t }: Props) {
  const [area, setArea] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const shown = useMemo(
    () => places.filter((p) => (!area || p.area === area) && (!theme || p.themes.includes(theme as keyof typeof THEMES))),
    [places, area, theme],
  );
  const chip = (key: string, label: string, on: boolean, set: (v: string | null) => void) => (
    <button type="button" class="chip" aria-pressed={on} onClick={() => set(on ? null : key)}>{label}</button>
  );
  return (
    <>
      <div class="filters">
        <div class="fgroup">
          <h2>{t.area}</h2>
          <div class="chips">
            {Object.entries(AREAS).map(([k, v]) => chip(k, v[lang], area === k, setArea))}
          </div>
        </div>
        <div class="fgroup">
          <h2>{t.theme}</h2>
          <div class="chips">
            {Object.entries(THEMES).map(([k, v]) => chip(k, v[lang], theme === k, setTheme))}
          </div>
        </div>
        {(area || theme) && (
          <button type="button" class="linkbtn" onClick={() => { setArea(null); setTheme(null); }}>{t.clear}</button>
        )}
      </div>
      <p class="count" aria-live="polite">{shown.length} {shown.length === 1 ? t.one : t.many}</p>
      {shown.length === 0 && <p>{t.none}</p>}
      <div class="grid">
        {shown.map((p) => (
          <article class="card" key={p.id}>
            {p.photo && <img src={p.photo.src} alt="" loading="lazy" />}
            <h3>{p.name}</h3>
            <p class="meta">{AREAS[p.area][lang]} · {p.themes.map((x) => THEMES[x][lang]).join(', ')}</p>
            <p>{p.text}</p>
            {p.tip && <div class="tip">{p.tip}</div>}
            {p.how && <div class="tip"><strong>{t.how}:</strong> {p.how}</div>}
            {p.photo && (
              <p class="credit">{t.photoBy}: <a href={p.photo.sourceUrl}>{p.photo.author}</a>, {p.photo.license}</p>
            )}
            <div class="links">
              {p.links.some((l) => l.type === 'map') ? null : (
                <a class="btn" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.query)}`}>{t.map}</a>
              )}
              {p.links.map((l) => (
                <a class="btn" target="_blank" rel="noopener" href={l.url}>{l.label ?? t[l.type]}</a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
