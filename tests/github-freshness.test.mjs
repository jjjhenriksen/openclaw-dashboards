import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';

const html = await fs.readFile(new URL('../openclaw-contributions/openclaw-contributions-override.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const settle = () => new Promise(resolve => setImmediate(resolve));
const item = number => ({ number, title: `Contribution ${number}`, repository_url: 'https://api.github.com/repos/openclaw/openclaw', html_url: `https://github.com/openclaw/openclaw/pull/${number}`, updated_at: '2026-10-10T00:00:00Z' });

function node(text = '') {
  const classes = new Set();
  return { textContent: text, innerHTML: '', dataset: {}, querySelector: () => null, closest: () => null,
    querySelectorAll: () => [], dispatchEvent() {},
    classList: { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) } };
}

function mount(responses) {
  const nodes = new Map(['m-prs', 'm-prrepos', 'pr-note', 'prs', 'repos', 'q-github', 'status', 'status-filter', 'signals'].map(id => [id, node()]));
  const title = node('8 merged PRs');
  const detail = node('Merged activity');
  const signal = node();
  signal.querySelector = selector => selector === 'strong' ? title : detail;
  nodes.get('signals').querySelectorAll = () => [signal];
  let refresh;
  vm.runInNewContext(script, {
    document: { getElementById: id => nodes.get(id), querySelector: selector => nodes.get(selector.slice(1)), body: {} },
    Event: class {},
    MutationObserver: class { constructor(callback) { refresh = callback; } observe() {} },
    fetch: async () => {
      const response = responses.shift();
      if (response instanceof Error) throw response;
      if (!response) throw new Error('Unexpected request');
      return { ok: response.status === 200, status: response.status, json: async () => response.body, headers: { get: () => '20' } };
    },
  });
  return { nodes, title, detail, refresh: async () => { nodes.get('pr-note').textContent = 'Merged activity'; refresh(); await settle(); } };
}

for (const failure of [new Error('Network unavailable'), { status: 403, body: { message: 'API rate limit exceeded' } }]) {
  test(`successful search followed by ${failure instanceof Error ? 'network failure' : 'rate limiting'} withholds stale counts and recovers`, async () => {
    const page = mount([{ status: 200, body: { items: [item(1), item(2)] } }, failure, { status: 200, body: { items: [item(3)] } }]);
    await settle();
    assert.equal(page.nodes.get('m-prs').textContent, 2);
    assert.equal(page.title.textContent, '2 open PRs in scope');
    assert.match(page.nodes.get('q-github').innerHTML, /GitHub: fresh/);
    await page.refresh();
    for (const id of ['m-prs', 'm-prrepos']) assert.equal(page.nodes.get(id).textContent, '—');
    assert.equal(page.title.textContent, 'Open-PR search unavailable');
    assert.match(page.detail.textContent, /Previous counts withheld/);
    assert.match(page.nodes.get('q-github').innerHTML, /GitHub: stale.*Last successful search/);
    assert.equal(page.nodes.get('q-github').classList.contains('warn'), true);
    assert.equal(page.nodes.get('status').dataset.tone, 'warn');
    await page.refresh();
    assert.equal(page.nodes.get('m-prs').textContent, 1);
    assert.equal(page.title.textContent, '1 open PR in scope');
    assert.match(page.nodes.get('q-github').innerHTML, /GitHub: fresh/);
    assert.equal(page.nodes.get('q-github').classList.contains('warn'), false);
    assert.equal(page.nodes.get('status').dataset.tone, '');
  });
}

test('an initial failure is unavailable, not stale or fresh, and a later refresh succeeds', async () => {
  const page = mount([new Error('Offline'), { status: 200, body: { items: [] } }]);
  await settle();
  assert.match(page.nodes.get('q-github').innerHTML, /GitHub: unavailable/);
  assert.doesNotMatch(page.nodes.get('q-github').innerHTML, /Last successful/);
  assert.equal(page.title.textContent, 'Open-PR search unavailable');
  await page.refresh();
  assert.equal(page.nodes.get('m-prs').textContent, 0);
  assert.equal(page.title.textContent, '0 open PRs in scope');
  assert.match(page.nodes.get('q-github').innerHTML, /GitHub: fresh/);
});


test('scope filtering includes an allowed repository on the second search page', async () => {
  const outside = Array.from({ length: 100 }, (_, index) => ({ ...item(index + 1), repository_url: 'https://api.github.com/repos/other/project' }));
  const page = mount([
    { status: 200, body: { total_count: 101, incomplete_results: false, items: outside } },
    { status: 200, body: { total_count: 101, incomplete_results: false, items: [item(101)] } },
  ]);
  await settle();
  assert.equal(page.nodes.get('m-prs').textContent, 1);
  assert.match(page.nodes.get('prs').innerHTML, /Contribution 101/);
  assert.match(page.nodes.get('q-github').innerHTML, /GitHub: fresh/);
});

for (const body of [
  { total_count: 1, incomplete_results: true, items: [item(1)] },
  { total_count: 1001, incomplete_results: false, items: [item(1)] },
  { total_count: 2, incomplete_results: false, items: [] },
]) {
  test(`incomplete or capped coverage with total ${body.total_count} withholds authoritative totals`, async () => {
    const page = mount([{ status: 200, body }]);
    await settle();
    assert.equal(page.nodes.get('m-prs').textContent, '—');
    assert.equal(page.nodes.get('m-prrepos').textContent, '—');
    assert.match(page.nodes.get('status').textContent, /incomplete|truncated/);
    assert.equal(page.nodes.get('q-github').classList.contains('warn'), true);
  });
}
