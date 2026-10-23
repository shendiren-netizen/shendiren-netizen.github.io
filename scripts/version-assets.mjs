import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

// Version the source HTML too: direct file previews and branch-based Pages
// publishing must request the same resources as the dist build.
export async function versionAssets() {
  const html = await readFile('index.html', 'utf8');
  const paths = [...new Set([...html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:\?[^"#]*)?"/g)].map(match => match[1]))];
  let versioned = html;
  for (const path of paths) {
    const hash = createHash('sha256').update(await readFile(path)).digest('hex').slice(0, 12);
    const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    versioned = versioned.replace(new RegExp(`((?:src|href)=")${escaped}(?:\\?[^"#]*)?"`, 'g'), `$1${path}?v=${hash}"`);
  }
  await writeFile('index.html', versioned);
  console.log(`Versioned ${paths.length} local resources by content.`);
}
