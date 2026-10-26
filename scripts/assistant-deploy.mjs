import { spawnSync } from 'node:child_process';
import { writeFile, access } from 'node:fs/promises';
const run=(args,stdio='pipe')=>spawnSync('npm',['--prefix','worker',...args],{encoding:'utf8',stdio});
try { await access('worker/node_modules/.bin/wrangler'); } catch {
  const install=run(['ci','--no-audit','--no-fund'],'inherit');
  if(install.status!==0)process.exit(install.status||1);
}
const auth=run(['run','whoami']);
if(auth.status!==0||/not authenticated|not logged in/i.test((auth.stdout||'')+(auth.stderr||''))){
  console.error('Cloudflare login is required. Run: npm exec --prefix worker -- wrangler login\nThen run npm run assistant:deploy again.');process.exit(1);
}
const deploy=run(['run','deploy']);process.stdout.write(deploy.stdout||'');process.stderr.write(deploy.stderr||'');
if(deploy.status!==0)process.exit(deploy.status||1);
const url=(deploy.stdout||'').match(/https:\/\/diren-profile-assistant\.[a-z0-9-]+\.workers\.dev\b/i)?.[0];
if(!url){console.error('Worker deployed. Use its displayed URL with npm run assistant:configure -- https://YOUR-WORKER.workers.dev/chat, then npm run build.');process.exit(1);}
await writeFile('assistant/config.json',JSON.stringify({apiUrl:url+'/chat'},null,2)+'\n');
const build=spawnSync('npm',['run','build'],{stdio:'inherit'});if(build.status!==0)process.exit(build.status||1);
console.log('Backend deployed and frontend endpoint saved. Commit and push the site files to publish on GitHub Pages.');
