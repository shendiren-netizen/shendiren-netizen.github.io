import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
const config = JSON.parse(await readFile('assistant/config.json','utf8'));
config.apiUrl = process.env.ASSISTANT_API_URL ?? config.apiUrl;
if (config.apiUrl) {
  const url = new URL(config.apiUrl);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['127.0.0.1','localhost'].includes(url.hostname))) throw new Error('Assistant API must use HTTPS (except localhost).');
  if (!url.pathname.endsWith('/chat') || url.username || url.password || url.search || url.hash) throw new Error('Assistant API URL must end in /chat and contain no credentials, query or fragment.');
}
await build({ entryPoints:['assistant/client.mjs'], bundle:true, define:{ __ASSISTANT_API_URL__:JSON.stringify(config.apiUrl) }, format:'iife', target:['es2020'], minify:true, outfile:'assistant.bundle.js', legalComments:'inline' });
console.log(`Assistant built (${config.apiUrl ? 'AI endpoint configured' : 'confirmed FAQ mode; no AI endpoint configured'}).`);
