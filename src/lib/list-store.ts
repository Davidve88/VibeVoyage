import { useEffect, useState } from 'preact/hooks';

const KEY = 'vv-list';

export interface ListState {
  saved: string[];
  visited: string[];
}

let state: ListState = { saved: [], visited: [] };
let known: Set<string> | null = null;
let loaded = false;
const subs = new Set<() => void>();

/** visited is always a subset of saved; unknown ids and duplicates are dropped. */
function sanitize(s: ListState): ListState {
  const ok = (id: unknown): id is string => typeof id === 'string' && (!known || known.has(id));
  const saved = [...new Set((s.saved || []).filter(ok))];
  const visited = [...new Set((s.visited || []).filter(ok))].filter((id) => saved.includes(id));
  return { saved, visited };
}

function notify() {
  subs.forEach((f) => f());
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  notify();
}

/** Call once with every valid place id so stale ids are dropped. */
export function setKnownIds(ids: string[]) {
  known = new Set(ids);
  state = sanitize(state);
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {}
}

export function getState(): ListState {
  return state;
}

export function isSaved(id: string) {
  return state.saved.includes(id);
}

export function toggleSaved(id: string) {
  if (known && !known.has(id)) return;
  state = isSaved(id)
    ? { saved: state.saved.filter((x) => x !== id), visited: state.visited.filter((x) => x !== id) }
    : { saved: [...state.saved, id], visited: state.visited };
  persist();
}

export function toggleVisited(id: string) {
  if (!isSaved(id)) return;
  state = {
    saved: state.saved,
    visited: state.visited.includes(id) ? state.visited.filter((x) => x !== id) : [...state.visited, id],
  };
  persist();
}

/** Adds ids to the list without removing or changing anything already there. */
export function mergeSaved(ids: string[]) {
  state = sanitize({ saved: [...state.saved, ...ids], visited: state.visited });
  persist();
}

/** Share link payload: saved ids only (visited is private). */
export function encodeIds(ids: string[]) {
  return ids.join(',');
}

export function parseIds(raw: string): string[] {
  const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const valid = known ? ids.filter((id) => known!.has(id)) : ids;
  return [...new Set(valid)];
}

/** Reactive view of the list for components. Loads from localStorage after hydration. */
export function useList(): ListState {
  const [snap, setSnap] = useState<ListState>(state);
  useEffect(() => {
    load();
    setSnap(state);
    const fn = () => setSnap(state);
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  }, []);
  return snap;
}
