import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Validate the exported document, rather than relying on browser error recovery.
for (const relative of ['openclaw-contributions/index.html', 'life-radar/index.html', 'from-the-center-of-the-square/index.html']) {
  const html = await readFile(new URL('../' + relative, import.meta.url), 'utf8');
  for (const tag of ['html', 'body']) {
    assert.equal((html.match(new RegExp('<' + tag + '(?:\\s|>)', 'gi')) || []).length, 1, `${relative}: one opening ${tag}`);
    assert.equal((html.match(new RegExp('</' + tag + '>', 'gi')) || []).length, 1, `${relative}: one closing ${tag}`);
  }
  assert.match(html, /<\/body>\s*<\/html>\s*$/i, `${relative}: nothing after document close`);
}
console.log('Static export document boundaries passed.');
