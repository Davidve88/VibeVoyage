import { useMemo, useState } from 'preact/hooks';
import { THEMES, type Lang } from '../data/taxonomy';

export interface PlaceData {
  id: string;
  name: string;
  themes: (keyof typeof THEMES)[];
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
export interface ListStrings {
  theme: string; clear: string; one: string; many: string; none: string;
  map: string; tix: string; web: string; how: string; time: string;
  more: string; less: string; nearby: string; walk: string; uphill: string; photoBy: string;
}

interface CardProps {
  p: PlaceData;
  lang: Lang;
  t: ListStrings;
  goTo: (id: string) => void;
}

function Card({ p, lang, t, goTo }: CardProps) {
  const [open, setOpen] = useState(false);
  const gid = `good-${p.id}`;
  const hasMore = (p.good && p.good.length > 0) || p.nearby.length > 0;
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

interface Props { lang: Lang; places: PlaceData[]; t: ListStrings }

export default function PlaceList({ lang, places, t }: Props) {
  const [theme, setTheme] = useState<string | null>(null);
  const shown = useMemo(
    () => places.filter((p) => !theme || p.themes.includes(theme as keyof typeof THEMES)),
    [places, theme],
  );

  // Jump to a nearby place; if the theme filter hides it, clear the filter first.
  const goTo = (id: string) => {
    const target = places.find((p) => p.id === id);
    if (target && theme && !target.themes.includes(theme as keyof typeof THEMES)) setTheme(null);
    setTimeout(() => {
      const el = document.getElementById(`place-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el?.focus({ preventScroll: true });
    }, 50);
  };

  return (
    <>
      <div class="filters">
        <div class="fgroup">
          <h2>{t.theme}</h2>
          <div class="chips">
            {Object.entries(THEMES).map(([k, v]) => (
              <button type="button" class="chip" aria-pressed={theme === k} onClick={() => setTheme(theme === k ? null : k)}>
                {v[lang]}
              </button>
            ))}
          </div>
        </div>
        {theme && (
          <button type="button" class="linkbtn" onClick={() => setTheme(null)}>{t.clear}</button>
        )}
      </div>
      <p class="count" aria-live="polite">{shown.length} {shown.length === 1 ? t.one : t.many}</p>
      {shown.length === 0 && <p>{t.none}</p>}
      <div class="grid">
        {shown.map((p) => <Card key={p.id} p={p} lang={lang} t={t} goTo={goTo} />)}
      </div>
    </>
  );
}
