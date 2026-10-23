import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
const copies = [
 ['simplex-noise/LICENSE', 'vendor/SIMPLEX-NOISE-LICENSE.txt'],
 ['gsap/dist/gsap.min.js', 'vendor/gsap.min.js'],
 ['gsap/dist/ScrollTrigger.min.js', 'vendor/ScrollTrigger.min.js'],
 ['gsap/dist/ScrambleTextPlugin.min.js', 'vendor/ScrambleTextPlugin.min.js'],
 ['@tsparticles/slim/tsparticles.slim.bundle.min.js', 'vendor/tsparticles.slim.bundle.min.js'],
 ['@tsparticles/slim/LICENSE', 'vendor/TSPARTICLES-LICENSE.txt'],
 ['canvas-confetti/dist/confetti.browser.js', 'vendor/confetti.browser.js'],
 ['canvas-confetti/LICENSE', 'vendor/CANVAS-CONFETTI-LICENSE.txt'],
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
html = html.replace(/(?:<!-- @license lucide-static[^>]*-->\s*)*<svg data-icon="([a-z-]+)"[\s\S]*?<\/svg>\s*/g, (match, name) => `<!--icon:${name}-->`);
for (const name of ['code-xml', 'cpu', 'dumbbell', 'arrow-up-right', 'arrow-up', 'mountain', 'sparkles', 'graduation-cap']) {
 const svg = (await readFile(`assets/icons/${name}.svg`, 'utf8')).trim().replace(/<svg\s/, `<svg data-icon="${name}" aria-hidden="true" `);
 html = html.replaceAll(`<!--icon:${name}-->`, svg);
}
await writeFile('index.html', html);
await build({
 entryPoints: ['node_modules/simplex-noise/dist/esm/simplex-noise.js'],
 bundle: true, format: 'iife', globalName: 'SimplexNoise', minify: true,
 target: ['es2020'], outfile: 'assets/vendor/simplex-noise.min.js', legalComments: 'inline',
});
console.log('Local fonts, particles, noise and selected Lucide SVGs prepared.');
