import { useEffect, useRef } from 'preact/hooks';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toggleSaved, type ListState } from '../lib/list-store';
import type { PlaceData, Strings } from './PlaceList';

// One place to swap the tile provider later.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const CENTER: [number, number] = [41.3874, 2.1686];

type PinState = 'none' | 'saved' | 'visited';
const SYMBOL: Record<PinState, string> = { none: '•', saved: '★', visited: '✓' };

function stateOf(id: string, list: ListState): PinState {
  return list.visited.includes(id) ? 'visited' : list.saved.includes(id) ? 'saved' : 'none';
}

function iconFor(state: PinState) {
  return L.divIcon({
    className: 'pin-wrap',
    html: `<span class="pin pin-${state}" aria-hidden="true">${SYMBOL[state]}</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

interface Props {
  places: PlaceData[];
  t: Strings;
  list: ListState;
  goTo: (id: string) => void;
}

export default function MapView({ places, t, list, goTo }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  // Latest values for popup callbacks (markers outlive renders).
  const latest = useRef({ list, goTo, t });
  latest.current = { list, goTo, t };

  const popupFor = (p: PlaceData) => {
    const { list: l, goTo: go, t: s } = latest.current;
    const box = document.createElement('div');
    box.className = 'pop';
    const h = document.createElement('strong');
    h.textContent = p.name;
    const meta = document.createElement('div');
    meta.className = 'time';
    meta.textContent = `${p.cost} · ${p.time}`;
    const add = document.createElement('button');
    add.type = 'button';
    const saved = l.saved.includes(p.id);
    add.className = `btn save${saved ? ' on' : ''}`;
    add.setAttribute('aria-pressed', String(saved));
    add.textContent = saved ? s.inList : s.add;
    add.onclick = () => toggleSaved(p.id);
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'linkbtn';
    more.textContent = s.seeDetails;
    more.onclick = () => go(p.id);
    box.append(h, meta, add, more);
    return box;
  };

  // Create the map once.
  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { center: CENTER, zoom: 13, scrollWheelZoom: false });
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    setTimeout(() => m.invalidateSize(), 0);
    return () => {
      m.remove();
      map.current = null;
      markers.current.clear();
    };
  }, []);

  // Rebuild pins when the filtered places change; fit the view to them.
  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    markers.current.clear();
    for (const p of places) {
      const mk = L.marker(p.coords, { icon: iconFor(stateOf(p.id, latest.current.list)), title: p.name, alt: p.name, keyboard: true });
      mk.bindPopup(() => popupFor(p), { minWidth: 200 });
      mk.addTo(g);
      markers.current.set(p.id, mk);
    }
    if (places.length) m.fitBounds(L.latLngBounds(places.map((p) => p.coords)), { padding: [40, 40], maxZoom: 15 });
  }, [places]);

  // Update pin state and any open popup in place when the list changes.
  useEffect(() => {
    for (const p of places) {
      const mk = markers.current.get(p.id);
      if (!mk) continue;
      mk.setIcon(iconFor(stateOf(p.id, list)));
      if (mk.isPopupOpen()) mk.setPopupContent(popupFor(p));
    }
  }, [list]);

  return (
    <section>
      <div ref={el} class="map" role="region" aria-label={t.viewMap} />
      <ul class="legend">
        <li><span class="pin pin-none" aria-hidden="true">{SYMBOL.none}</span> {t.legendNone}</li>
        <li><span class="pin pin-saved" aria-hidden="true">{SYMBOL.saved}</span> {t.legendSaved}</li>
        <li><span class="pin pin-visited" aria-hidden="true">{SYMBOL.visited}</span> {t.legendVisited}</li>
      </ul>
    </section>
  );
}
