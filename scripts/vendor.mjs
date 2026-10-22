import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
const copies = [
 ['gsap/dist/gsap.min.js', 'vendor/gsap.min.js'],
 ['rough-notation/lib/rough-notation.iife.js', 'vendor/rough-notation.js'],
 ['rough-notation/LICENSE', 'vendor/ROUGH-NOTATION-LICENSE.txt'],
 ['lucide-static/LICENSE', 'vendor/LUCIDE-LICENSE.txt'],
 ['@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2', 'fonts/space-grotesk.woff2'],
 ['@fontsource-variable/space-grotesk/LICENSE', 'fonts/SPACE-GROTESK-LICENSE.txt'],
 ['@fontsource/caveat/files/caveat-latin-600-normal.woff2', 'fonts/caveat.woff2'],
 ['@fontsource/caveat/LICENSE', 'fonts/CAVEAT-LICENSE.txt'],
];
await mkdir('assets/fonts', { recursive: true });
await mkdir('assets/icons', { recursive: true });
for (const [source, target] of copies) await cp(`node_modules/${source}`, `assets/${target}`);
for (const name of ['code-xml', 'cpu', 'dumbbell', 'arrow-up-right', 'arrow-up', 'mountain', 'sparkles', 'graduation-cap']) {
 await cp(`node_modules/lucide-static/icons/${name}.svg`, `assets/icons/${name}.svg`);
}
// Inline only the selected icons so the page remains complete when opened as a file.
let html = await readFile('index.html', 'utf8');
html = html.replace(/<svg data-icon="([a-z-]+)"[\s\S]*?<\/svg>/g, (match, name) => `<!--icon:${name}-->`);
for (const name of ['code-xml', 'cpu', 'dumbbell', 'arrow-up-right', 'arrow-up', 'mountain', 'sparkles', 'graduation-cap']) {
 const svg = (await readFile(`assets/icons/${name}.svg`, 'utf8')).replace(/<svg\s/, `<svg data-icon="${name}" aria-hidden="true" `);
 html = html.replaceAll(`<!--icon:${name}-->`, svg);
}
await writeFile('index.html', html);
console.log('Local fonts, annotations and selected Lucide SVGs prepared.');
