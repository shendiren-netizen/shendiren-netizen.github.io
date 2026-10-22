import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const item of ['index.html', 'style.css', 'script.js', 'effects.js', 'assets']) {
  await cp(item, `dist/${item}`, { recursive: true });
}
await cp('index.html', 'dist/404.html');
console.log('Built → dist/ (GitHub Pages ready)');
