# VibeVoyage

Places with a great vibe, handpicked by you, for your people.

A static, trilingual (EN / DE / ES) guide to Barcelona. No backend and no accounts: everything a visitor saves stays on their device.

Live site: https://davidve88.github.io/VibeVoyage/

## Features
- Place cards with photos (Wikimedia Commons, credited), cost label, approximate time, "More details" and a **Nearby** list (computed from coordinates, with optional hand-picked overrides).
- Theme filter, shared by the **Places** and **Map** views (Leaflet + OpenStreetMap, loaded only when the map is opened).
- **My list**: add places from a card or a map pin, tick them as visited, share the list as a link or as text.
- Text-size control, dark mode, cookieless analytics (Cloudflare Web Analytics).
- `?for=noemi` shows a personal welcome card.

## Develop
```bash
npm install
npm run dev      # http://localhost:4321/VibeVoyage/
npm run build    # static output in dist/
```
Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Add or edit a place
One JSON file per place in `src/content/places/`; the schema is in `src/content.config.ts` and the build fails on missing fields.

- `text`, `tip`, `how`, `good` (More details bullets) are written in `en`, `de` and `es`.
- `themes`, `area`, `cost` use ids from `src/data/taxonomy.ts` (`area` is kept in the data but not shown as a filter).
- `coords` drives the map and the Nearby list. Optional: `steep: true` for hilltop places (longer, "uphill" walking times) and `near: ["id", ...]` to override the computed Nearby list.
- `photo` points to a file in `src/assets/places/` plus author, licence and the Commons page URL (shown as the credit).
- Opening hours and prices are deliberately not stored; link to the official page instead.

## Storage keys (browser localStorage)
`vv-list` (saved + visited), `vv-fs` (text size), `vv-welcome` (welcome card dismissed).

## Analytics
Set the Cloudflare token (or an Umami website id) in `src/data/analytics.ts`. Leave `id` empty to ship no tracking script.

## Legacy
`legacy/` holds the original single-file prototype for reference.
