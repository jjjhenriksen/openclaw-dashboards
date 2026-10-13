import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('public calendar snapshot count matches its visible rows', () => {
  const html = readFileSync(new URL('../life-radar/index.html', import.meta.url), 'utf8');
  const section = html.match(/<section[^>]*aria-labelledby="calendar"[^>]*>([\s\S]*?)<\/section>/)[1];
  const count = Number(section.match(/class="badge">(\d+) blocks/)[1]);
  assert.equal(count, (section.match(/class="row(?: optional)?"/g) || []).length);
});
