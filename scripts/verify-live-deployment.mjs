import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Anonymous HTTP verification; no Cloudflare/GitHub credential enters requests.
const [directory, baseUrl] = process.argv.slice(2);
assert.ok(directory && baseUrl, 'Usage: node scripts/verify-live-deployment.mjs <dist> <https-url>');
const base = new URL(baseUrl);
assert.equal(base.protocol, 'https:');
async function files(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(path.join(folder, e.name)) : [path.join(folder, e.name)]))).flat();
}
const output = await files(directory);
const targets = output.filter(f => path.basename(f) !== '.nojekyll');
async function verify(file) {
  const relative = path.relative(directory, file).split(path.sep).join('/');
  const url = new URL(relative.endsWith('index.html') ? relative.slice(0, -10) : relative, base.href.endsWith('/') ? base : base.href + '/');
  const expected = await readFile(file);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20_000), cache: 'no-store' });
      assert.ok((relative === '404.html' ? [200, 404] : [200]).includes(response.status), `${url.pathname}: HTTP ${response.status}`);
      const actual = Buffer.from(await response.arrayBuffer());
      // Verify the complete artifact, so an older page with the same title cannot pass.
      assert.ok(actual.equals(expected), `${url.pathname}: live content differs from this commit's artifact`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 5000 * (attempt + 1)));
    }
  }
  throw lastError;
}
let cursor = 0;
await Promise.all(Array.from({ length: Math.min(6, targets.length) }, async () => {
  while (cursor < targets.length) await verify(targets[cursor++]);
}));
console.log(`Verified ${targets.length} live pages/assets match the deployed artifact at ${base.origin}.`);
