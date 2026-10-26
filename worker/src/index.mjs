import { sources, knowledgeVersion, faqAnswer } from '../../assistant/knowledge.mjs';
import { readEvents, encodeEvent } from '../../assistant/protocol.mjs';
import { MODEL, ApiError, parseInput, createMessages, tokenFromProvider } from './chat.mjs';

const headersFor = (origin, id) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Expose-Headers': 'X-Request-Id',
  'Vary': 'Origin', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'X-Request-Id': id,
  'Referrer-Policy': 'no-referrer'
});
const json = (body, status, headers) => Response.json(body, { status, headers });

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();
    const origin = request.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
    if (!origin || !allowed.includes(origin)) return json({ error: { code: 'ORIGIN_NOT_ALLOWED', requestId } }, 403, { 'Cache-Control': 'no-store', 'Vary': 'Origin' });
    const headers = headersFor(origin, requestId);
    const path = new URL(request.url).pathname;
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (path === '/health' && request.method === 'GET') return json({ status: env.AI && env.CHAT_RATE_LIMITER ? 'ready' : 'unavailable', knowledgeVersion }, env.AI && env.CHAT_RATE_LIMITER ? 200 : 503, headers);
    if (path !== '/chat') return json({ error: { code: 'NOT_FOUND', requestId } }, 404, headers);
    if (request.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', requestId } }, 405, { ...headers, Allow: 'POST, OPTIONS' });
    let timer;
    try {
      const input = await parseInput(request);
      if (!env.AI || !env.CHAT_RATE_LIMITER) throw new ApiError('AI_UNAVAILABLE', 503);
      // The rate binding stores counters only, never prompts or conversation text.
      const address = request.headers.get('CF-Connecting-IP') || 'local';
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(address));
      const key = Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
      const { success } = await env.CHAT_RATE_LIMITER.limit({ key });
      if (!success) return json({ error: { code: 'RATE_LIMITED', requestId } }, 429, { ...headers, 'Retry-After': '60' });
      const control = new AbortController();
      const abort = () => control.abort();
      request.signal.addEventListener('abort', abort, { once: true });
      timer = setTimeout(abort, 45000);
      let stream;
      const unknown = input.mode === 'chat' && /salary|visa|work rights|sponsor|gpa|\bage\b|薪资|薪水|工资|签证|工签|工作权|担保|绩点|年龄/iu.test(input.question);
      if (!unknown) {
        const inference = env.AI.run(MODEL, { messages: createMessages(input), stream: true, max_tokens: input.mode === 'job' ? 850 : 600, temperature: 0.2 });
        const abortPromise = new Promise((_, reject) => control.signal.addEventListener('abort', ()=>reject(new ApiError('AI_UNAVAILABLE',503)), { once:true }));
        // Cancel any late stream if inference outlives the request timeout.
        inference.then(s=>{if(control.signal.aborted && s instanceof ReadableStream) s.cancel().catch(()=>{});},()=>{});
        try { stream = await Promise.race([inference, abortPromise]); }
        catch (error) { clearTimeout(timer); request.signal.removeEventListener('abort', abort); throw error; }
        if (!(stream instanceof ReadableStream)) { clearTimeout(timer); request.signal.removeEventListener('abort', abort); throw new ApiError('AI_UNAVAILABLE', 503); }
      }
      const sourceMeta = sources.map(s=>({ id:s.id, title:s.title[input.lang], href:s.href, text:s.text[input.lang] }));
      const body = new ReadableStream({
        async start(controller) {
          let text = '', finished = false;
          const send = (event, data) => { if (!control.signal.aborted) controller.enqueue(encodeEvent(event, data)); };
          try {
            send('meta', { mode: 'ai', sources: sourceMeta, knowledgeVersion });
            if (unknown) {
              const answer = faqAnswer(input.question, input.lang);
              text = answer.text + ' [contact]'; send('delta', { text }); finished = true;
            } else {
              // Native Workers AI streams differ by model: accept OpenAI deltas
              // and the legacy {response} format, ignoring reasoning-only deltas.
              for await (const event of readEvents(stream, control.signal)) {
                if (event.data === '[DONE]') { finished = true; break; }
                let packet; try { packet = JSON.parse(event.data); } catch { throw new ApiError('AI_UNAVAILABLE',503); }
                const token = tokenFromProvider(packet);
                if (text.length + token.length > 7000) throw new ApiError('AI_UNAVAILABLE',503);
                if (token) { text += token; send('delta', { text: token }); }
                if (packet.choices?.[0]?.finish_reason === 'stop') finished = true;
                if (packet.choices?.[0]?.finish_reason === 'length') throw new ApiError('AI_UNAVAILABLE',503);
              }
            }
            if (control.signal.aborted || !finished || !text.trim()) throw new ApiError('AI_UNAVAILABLE',503);
            const ids = [...new Set([...text.matchAll(/\[([a-z-]+)\]/g)].map(m=>m[1]))];
            if (!ids.length || ids.some(id=>!sources.some(s=>s.id===id)) || /<\/?think>|<script|https?:\/\//iu.test(text)) throw new ApiError('AI_UNGROUNDED',503);
            send('done', { sourceIds: ids });
          } catch {
            // No prompt, JD, response, IP or history is written to application logs.
            try { controller.enqueue(encodeEvent('error', { code:'AI_UNAVAILABLE', requestId })); } catch {}
          } finally {
            clearTimeout(timer); request.signal.removeEventListener('abort', abort);
            try { controller.close(); } catch {}
          }
        },
        cancel() { control.abort(); clearTimeout(timer); request.signal.removeEventListener('abort', abort); }
      });
      return new Response(body, { headers: { ...headers, 'Content-Type':'text/event-stream; charset=utf-8' } });
    } catch (error) {
      clearTimeout(timer);
      return json({ error: { code: error instanceof ApiError ? error.code : 'AI_UNAVAILABLE', requestId } }, error instanceof ApiError ? error.status : 503, headers);
    }
  }
};
