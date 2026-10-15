# Barcelona Guide for Noemi: Project Handoff

Everything needed to continue developing this project in Claude Code. The working source is `barcelona-guide.html` (delivered alongside this file). Read this file first, then open the HTML.

## 1. Purpose and audience

- An interactive, bilingual (English / German) guide to places in Barcelona.
- Made by David for his friend **Noemi**, a 60-year-old adult who speaks English and German.
- Must be **friendly and easy to use** for her: large text, big tap targets, simple navigation, warm tone.
- Published as a private-by-default hosted page: https://claude.ai/artifact/WSikCTpH4XhB84JjZ8DcU6 (David shares it with Noemi himself).

## 2. Deliverable

- One self-contained file: `barcelona-guide.html` (HTML + CSS + vanilla JS, no frameworks, no external assets, no images).
- Mobile-first, works on desktop. Single column, max width 720px.
- Language switch (EN/DE), day-by-day navigation, place cards, "mark as seen" tracking, welcome card.

## 3. Source content

Original input was `Barcelona.md`: a list of places grouped as Gaudí and Modernisme, Gothic Quarter and El Born, Montjuïc, Views and neighbourhoods, Small excursions, followed by a "Grouped by location" plan. The page follows the **grouped-by-location plan**.

Additions beyond the source:
- **Port Vell** card (listed in the seafront group but had no description). Text is a short original line.
- Welcome message (see section 6).
- German translations of all text (written by Claude, **not yet reviewed by a native speaker**).

Note on source data: in `Barcelona.md` the Casa Batlló entry contained a Casa Milà link by mistake; in the page the La Pedrera tickets link is attached to Casa Milà / La Pedrera and the Batlló entry keeps only its Google Maps link.

## 4. Sections (days)

Seven tappable sections, in this order. Place ids refer to keys of the `P` object.

| # | EN title | DE title | Place ids |
|---|---|---|---|
| 1 | Hotel area (Raval / La Rambla, hotel base) | Rund ums Hotel | `rambla`, `gotic` |
| 2 | Gothic Quarter & El Born (one full day) | Gotisches Viertel & El Born | `cathedral`, `rei`, `gotic`, `smm`, `picasso`, `palau`, `ciut` |
| 3 | Gaudí interiors (Eixample, Passeig de Gràcia) | Gaudí von innen | `batllo`, `pedrera` |
| 4 | Sagrada Família & Gràcia (one day) | Sagrada Família & Gràcia | `sagrada`, `gracia`, `guell`, `bunkers` |
| 5 | Montjuïc (half or full day) | Montjuïc | `mnac`, `castle`, `poble` |
| 6 | Seafront (relaxed half-day) | Am Meer | `ciut`, `portvell`, `barceloneta` |
| 7 | Day trips (Montserrat and Tibidabo) | Ausflüge | `montserrat`, `tibi` |

Some places appear in more than one section (`gotic`, `ciut`); their "seen" state is shared because it is keyed by place id.

Section intro notes carried over from the source: choose one Gaudí house for the interior and view the other from outside; suggested route for day 4 is Sagrada Família in the morning, lunch in Gràcia, Park Güell in the afternoon, Búnkers del Carmel last; Montjuïc is best treated as its own half or full day; Tibidabo is less essential than Montserrat for first-time cultural visitors.

## 5. Code architecture

All in one `<script>` block at the end of the file, no build step.

### Data

- `T`: UI strings per language (`T.en`, `T.de`). Keys: `t` (title), `st` (subtitle), `wh` / `wb` / `wb2` / `wc` (welcome heading, body, second line, dismiss button), `day`, `seen`, `isSeen`, `prev`, `next`, `of`, `map`, `tix`, `web`, `how`.
- `P`: places, keyed by id. Fields:
  - `n`: display name (same in both languages)
  - `en`, `de`: descriptions
  - `l` (optional): array of links `[type, url, labelEn?, labelDe?]`. `type` is one of `map`, `tix`, `web`, which selects the default button label from `T`. Optional 3rd and 4th items override the label (used for "Sunday Mass" and "Getting there").
  - `tip` (optional): `[en, de]` highlighted note (used for Búnkers del Carmel uphill walk).
  - `how` (optional): `[en, de]` highlighted "How to get there" note (used for Montserrat: R5 train from Plaça d'Espanya, Aeri de Montserrat cable car).
- `D`: sections. Fields: `s` (short nav label), `h` (heading), `i` (intro), `p` (array of place ids), each as `{en, de}`, except `p`.

### State

- `L`: current language, `"en"` or `"de"`.
- `cur`: index of the current section.
- `seen`: object `{placeId: true}`.
- `wh`: whether the welcome card has been dismissed.

### Rendering

- `render()` rebuilds the title, welcome card, nav, section view and pager from state using `innerHTML`. Called after every state change.
- One delegated `click` listener on `document` handles: welcome dismiss (`#wc`), language buttons (`#bEN`, `#bDE`), pager (`#prev`, `#next`), nav buttons (`data-k`), and seen toggles (`data-id`).
- Every place card always shows an **Open map** button (a Google Maps search for "<name> Barcelona") unless the place already has its own `map` link.

### Persistence (browser localStorage, per device)

- `bcn-seen`: JSON of seen places
- `bcn-lang`: `"en"` or `"de"`
- `bcn-wel`: `"1"` once the welcome card is dismissed
- All access is wrapped in try/catch; the page works with empty storage. Default language is German if the browser language starts with `de`, otherwise English.

## 6. Welcome message

Shown at the top until dismissed, in the active language. Signed "— David". Warm, personal tone: made just for her, no rush, no need to see everything, take your time, have a coffee. A second line tells her to tap a day to begin. Dismiss button: "Got it, thank you!" / "Verstanden, danke!".

## 7. Visual design

- **Typography:** Arial, Helvetica, sans-serif. Base size 19px, line-height 1.6. Card titles 1.3rem, page title 2rem.
- **Colour tokens** (CSS variables on `:root`):

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f3f8fa` | `#13202a` |
| `--card` | `#ffffff` | `#1c2d39` |
| `--ink` | `#1f2a33` | `#eef4f7` |
| `--mute` | `#4f5f6b` | `#a9bcc7` |
| `--acc` (sea blue) | `#0e6a87` | `#6cc4e0` |
| `--accbg` | `#dcf0f6` | `#1f4556` |
| `--line` | `#cfdfe6` | `#34505f` |
| `--ok` (seen, green) | `#2b7a4b` | `#7fd6a0` |
| `--on` (text on accent/green) | `#ffffff` | `#0b1a22` |

- Dark mode follows the system setting via `prefers-color-scheme`, guarded with `:root:not([data-theme="light"])`, plus an explicit `:root[data-theme="dark"]` override.
- Components: rounded cards with 2px borders, a green border once a place is marked seen, pill-style segmented language switch, nav as a responsive grid of large buttons (min height 64px), large accent-coloured link buttons.
- Safe-area padding for phone notches via `env(safe-area-inset-*)`; viewport meta uses `viewport-fit=cover`.

## 8. Hosting constraints (if republished as an artifact)

These came from the hosting environment and still apply when publishing on claude.ai:
- Self-contained file under 16 MB.
- External scripts only from `cdnjs.cloudflare.com`, `cdn.jsdelivr.net/npm/`, `cdn.tailwindcss.com`, `code.jquery.com`; stylesheets only from Google Fonts. No remote images, no other network requests.
- Browser storage works but is private per viewer and device; guard it with try/catch.
- Outside claude.ai (for example, if moved to GitHub Pages or Netlify), none of these limits apply, but links to Google Maps and ticket sites open in a new tab as they do now.

## 9. Bugs fixed during development

- Language preference: an operator-precedence mistake in the language initialiser made the page open in German after English had been chosen and the page reloaded. Fixed with explicit parentheses.
- Duplicate "Open map" buttons on places that already had their own map link. Now only one is shown.

## 10. Open items and ideas (not yet decided or built)

These are suggestions, not agreed scope. Confirm with David before building.
- Have a native German speaker review the German text.
- Replace the generic Google Maps search link with exact Maps links for places that lack one.
- Add the Sunday Mass timing or other opening-hour details if David wants them (the source gave links only).
- Optional comfort features for Noemi: a text-size control, a "today" view, or a printable version.
- Photos were deliberately left out (no external images allowed on the hosted page; text-first design).

## 11. Working notes for Claude Code

- Treat `barcelona-guide.html` as the single source of truth; edit it in place and keep it self-contained.
- Keep everything bilingual: any new place needs `en` and `de` text, and any new UI string needs entries in both `T.en` and `T.de`.
- Keep the audience in mind: large text, short sentences, few choices on screen at once, no jargon.
- David prefers precise, low-effort interaction: ask one question at a time and ground explanations in what is in the files.
