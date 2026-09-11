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

## Scope

The repository intentionally contains the dashboard artifact only. Personal workspace configuration, credentials, private correspondence, and generated evidence are not included.
