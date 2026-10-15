export interface Spot {
  id: string;
  coords: [number, number];
  steep?: boolean;
  near?: string[];
}

export interface Nearby {
  id: string;
  min: number;
  uphill: boolean;
}

const STREET_FACTOR = 1.3; // straight line -> real street distance
const METRES_PER_MIN = 80;
const UPHILL_FACTOR = 1.5;
const MAX_MIN = 25;
const MAX_ITEMS = 3;

function metres(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function walk(a: Spot, b: Spot): Nearby {
  const uphill = !!(a.steep || b.steep);
  const raw = (metres(a.coords, b.coords) * STREET_FACTOR * (uphill ? UPHILL_FACTOR : 1)) / METRES_PER_MIN;
  return { id: b.id, min: Math.max(5, Math.round(raw / 5) * 5), uphill };
}

/** Hand-picked `near` wins; otherwise the closest few places within a short walk. */
export function nearbyFor(self: Spot, all: Spot[]): Nearby[] {
  const byId = new Map(all.map((s) => [s.id, s]));
  if (self.near) {
    return self.near.flatMap((id) => {
      const other = byId.get(id);
      if (!other) throw new Error(`Place "${self.id}" lists unknown near id "${id}"`);
      return other.id === self.id ? [] : [walk(self, other)];
    });
  }
  return all
    .filter((s) => s.id !== self.id)
    .map((s) => walk(self, s))
    .filter((n) => n.min <= MAX_MIN)
    .sort((a, b) => a.min - b.min)
    .slice(0, MAX_ITEMS);
}
