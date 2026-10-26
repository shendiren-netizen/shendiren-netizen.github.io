// Incremental SSE parser shared by the browser and Worker (handles UTF-8 splits).
export async function* readEvents(stream, signal) {
  const reader = stream.getReader();
  const cancel = () => { reader.cancel().catch(()=>{}); };
  signal?.addEventListener('abort', cancel, { once:true });
  if (signal?.aborted) cancel();
  const decoder = new TextDecoder();
  let buffer = '';
  const parse = frame => {
    let event = 'message'; const data = [];
    for (const line of frame.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
    }
    return data.length ? { event, data: data.join('\n') } : null;
  };
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      buffer += decoder.decode(value, { stream: !done });
      buffer = buffer.replace(/\r\n/g, '\n');
      if (buffer.length > 256000) throw new Error('STREAM_LIMIT');
      let split;
      while ((split = buffer.indexOf('\n\n')) !== -1) {
        const item = parse(buffer.slice(0, split)); buffer = buffer.slice(split + 2);
        if (item) yield item;
      }
      if (done) { if (buffer.trim()) { const item = parse(buffer); if (item) yield item; } break; }
    }
  } finally { signal?.removeEventListener('abort', cancel); await reader.cancel().catch(()=>{}); reader.releaseLock(); }
}
export function encodeEvent(event, data) {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
