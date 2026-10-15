import { toggleSaved, toggleVisited, type ListState } from '../lib/list-store';
import type { PlaceData, Strings } from './PlaceList';
import ShareBar from './ShareBar';

interface Props {
  places: PlaceData[];
  t: Strings;
  list: ListState;
  goTo: (id: string) => void;
}

export default function MyList({ places, t, list, goTo }: Props) {
  const byId = new Map(places.map((p) => [p.id, p]));
  const saved = list.saved.map((id) => byId.get(id)).filter((p): p is PlaceData => !!p);
  const toVisit = saved.filter((p) => !list.visited.includes(p.id));
  const visited = saved.filter((p) => list.visited.includes(p.id));

  const row = (p: PlaceData) => {
    const done = list.visited.includes(p.id);
    return (
      <li class={`row${done ? ' done' : ''}`} key={p.id}>
        <div class="rowmain">
          <strong>{p.name}</strong>
          <span class="time">{p.cost} · {p.time}</span>
        </div>
        <div class="rowact">
          <label class="check">
            <input type="checkbox" checked={done} onChange={() => toggleVisited(p.id)} />
            <span>{t.visitedCheck}</span>
          </label>
          <button type="button" class="linkbtn" onClick={() => goTo(p.id)}>{t.seeDetails}</button>
          <button type="button" class="linkbtn" onClick={() => toggleSaved(p.id)}>{t.remove}</button>
        </div>
      </li>
    );
  };

  if (saved.length === 0) {
    return (
      <section class="empty">
        <p><strong>{t.emptyList}</strong></p>
        <p>{t.emptyHint}</p>
      </section>
    );
  }

  return (
    <section>
      <ShareBar places={places} t={t} list={list} />
      {toVisit.length > 0 && (
        <>
          <h2 class="lh">{t.toVisit} ({toVisit.length})</h2>
          <ul class="rows">{toVisit.map(row)}</ul>
        </>
      )}
      {visited.length > 0 && (
        <>
          <h2 class="lh">{t.visitedH} ({visited.length})</h2>
          <ul class="rows">{visited.map(row)}</ul>
        </>
      )}
    </section>
  );
}
