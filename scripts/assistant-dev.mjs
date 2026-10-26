import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import worker from '../worker/src/index.mjs';
// No local model is impersonated: without an authenticated Workers AI binding,
// this adapter returns unavailable and the browser uses confirmed FAQ answers.
const build=spawnSync('npm',['run','build'],{stdio:'inherit',env:{...process.env,ASSISTANT_API_URL:'http://127.0.0.1:5173/api/chat'}});
if(build.status!==0)process.exit(build.status||1);
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname.startsWith('/api/')){
    const request=new Request('http://127.0.0.1:5173/'+pathname.slice(5),{method:req.method,headers:req.headers,...(req.method==='POST'?{body:ReadableStream.from(req),duplex:'half'}:{})});
    const response=await worker.fetch(request,{ALLOWED_ORIGINS:'http://127.0.0.1:5173,http://localhost:5173'});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  try{const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(root+sep))throw Error();res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}
  catch{res.writeHead(404);res.end('Not found');}
});
server.listen(5173,'127.0.0.1',()=>console.log('Assistant preview: http://127.0.0.1:5173 (confirmed FAQ mode).'));
for(const event of ['SIGINT','SIGTERM'])process.on(event,()=>server.close(()=>process.exit(0)));
