import { writeFile } from 'node:fs/promises';
const value = process.argv[2];
if (!value) throw new Error('Usage: npm run assistant:configure -- https://YOUR-DEPLOYED-WORKER.workers.dev/chat');
const url = new URL(value);
if (url.protocol!=='https:' || !url.pathname.endsWith('/chat') || url.username || url.password || url.search || url.hash) throw new Error('Supply the deployed HTTPS Worker /chat URL. Do not supply an API key.');
await writeFile('assistant/config.json', JSON.stringify({ apiUrl:url.href },null,2)+'\n');
console.log('Public assistant endpoint saved. Run npm run build, then commit and push the updated files.');
