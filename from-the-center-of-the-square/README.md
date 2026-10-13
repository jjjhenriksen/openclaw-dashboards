# From the Center of the Square

Public static export of Jacqueline Henriksen's Sacred Harp project overview, dated September 12, 2026.

## View from a clean checkout

Open [`index.html`](index.html) directly in a browser, or serve the repository:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/from-the-center-of-the-square/`.
The entry point is a complete standalone HTML document with inline styling.
It makes no live corpus, Calendar, or OpenClaw requests. Counts and project
summaries are historical snapshot values, not current inventory.

## Assets and updates

`app.js`, `styles.css`, and `fonts.css` are retained historical dashboard assets.
The static `index.html` does not load them. No `data.js` runtime bundle is shipped;
these files alone cannot reproduce the original interactive, edition-aware dashboard.

The original working dashboard was the local `sh-corpus-scripts/dashboard`
project, which is not part of this repository. To update this public export,
prepare and review a new static HTML snapshot from that source, retain the
snapshot date, check public source links and document structure, and replace
`index.html` through a pull request. A clean checkout reproduces viewing the
published snapshot; regeneration requires the original source and its data.

Publish only intentionally public artifacts. Private notes and connected-service
values stay outside this bundle. Evidence without a public counterpart must be
identified as unavailable to visitors.
