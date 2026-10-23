import { cp, mkdir, rm } from 'node:fs/promises';
import { versionAssets } from './version-assets.mjs';
await versionAssets();
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const item of ['index.html', 'style.css', 'i18n.js', 'script.js', 'effects.js', 'background.js', 'assets']) {
  await cp(item, `dist/${item}`, { recursive: true });
}
await cp('index.html', 'dist/404.html');
console.log('Built → dist/ (GitHub Pages ready)');
