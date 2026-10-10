# OpenClaw Contributions Dashboard

A focused OpenClaw contributions view for the OpenClaw dashboard surface.

The dashboard scopes live GitHub data to:

- Open pull requests authored by `jjjhenriksen`
- OpenClaw-backed repositories and known OpenClaw forks/plugins
- Active, unarchived OpenClaw threads from the surrounding dashboard ledger

## Contents

- [`openclaw-contributions-override.html`](openclaw-contributions-override.html) — the dashboard override script

## Notes

This file is an override intended to run inside the existing OpenClaw dashboard document. It expects the surrounding dashboard markup and IDs used by that surface; it is not a standalone HTML page.

The script queries GitHub's public API from the browser and does not contain credentials. GitHub API availability and rate limits are reported in the dashboard when available.

Failed refreshes withhold current totals in the metrics, repository list, and
summary signal. GitHub quality becomes **stale** after an earlier successful
search, or **unavailable** before the first success. The last successful search
time remains visible as context; a later successful refresh restores current
counts. The separate thread/session source keeps its own freshness boundary.

Run `node --test tests/github-freshness.test.mjs` from the repository root to
exercise success, network/rate-limit failure, and recovery with isolated fixtures.
The static `index.html` export has no live connection; these checks cover the
override intended for a host dashboard. Search coverage limits are tracked
separately in issue #6.

## Scope

The repository intentionally contains the dashboard artifact only. Personal workspace configuration, credentials, private correspondence, and generated evidence are not included.
