import { useEffect, useMemo, useState } from 'preact/hooks';
import { THEMES, type Lang } from '../data/taxonomy';
import { setKnownIds, useList } from '../lib/list-store';
import MyList from './MyList';
import PlaceCards, { type PlaceData, type Strings } from './PlaceList';

type View = 'places' | 'map' | 'list';

interface Props { lang: Lang; places: PlaceData[]; t: Strings }

function viewFromHash(): View {
  const h = typeof location === 'undefined' ? '' : location.hash.replace('#', '');
  return h === 'list' ? 'list' : h === 'map' ? 'map' : 'places';
}

export default function App({ lang, places, t }: Props) {
  setKnownIds(places.map((p) => p.id)); // idempotent; must run before the list loads
  const list = useList();
  const [view, setViewState] = useState<View>('places');
  const [theme, setTheme] = useState<string | null>(null);
  // Leaflet (and its CSS) load only when the map is first opened.
  const [MapComp, setMapComp] = useState<any>(null);
  useEffect(() => {
    if (view === 'map' && !MapComp) import('./MapView').then((m) => setMapComp(() => m.default));
  }, [view, MapComp]);

  useEffect(() => {
    setViewState(viewFromHash());
    const onHash = () => setViewState(viewFromHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const setView = (v: View) => {
    setViewState(v);
    history.replaceState(null, '', v === 'places' ? location.pathname + location.search : `#${v}`);
  };

  const shown = useMemo(
    () => places.filter((p) => !theme || p.themes.includes(theme as keyof typeof THEMES)),
    [places, theme],
  );

  // Jump to a place's card: switch to Places, clear the theme filter if it hides the card.
  const goTo = (id: string) => {
    const target = places.find((p) => p.id === id);
    if (target && theme && !target.themes.includes(theme as keyof typeof THEMES)) setTheme(null);
    if (view !== 'places') setView('places');
    setTimeout(() => {
      const el = document.getElementById(`place-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el?.focus({ preventScroll: true });
    }, 80);
  };

  const views: [View, string][] = [
    ['places', t.viewPlaces],
    ['map', t.viewMap],
    ['list', `${t.viewList}${list.saved.length ? ` (${list.saved.length})` : ''}`],
  ];

  return (
    <>
      <div class="seg views" role="group" aria-label={t.viewLabel}>
        {views.map(([v, label]) => (
          <button type="button" class={view === v ? 'on' : ''} aria-pressed={view === v} onClick={() => setView(v)}>
            {label}
          </button>
        ))}
      </div>

      {view !== 'list' && (
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
            {theme && <button type="button" class="linkbtn" onClick={() => setTheme(null)}>{t.clear}</button>}
          </div>
          <p class="count" aria-live="polite">{shown.length} {shown.length === 1 ? t.one : t.many}</p>
          {view === 'places' && <PlaceCards places={shown} lang={lang} t={t} list={list} goTo={goTo} />}
          {view === 'map' && MapComp && <MapComp places={shown} t={t} list={list} goTo={goTo} />}
        </>
      )}

      {view === 'list' && <MyList places={places} t={t} list={list} goTo={goTo} />}
    </>
  );
}
