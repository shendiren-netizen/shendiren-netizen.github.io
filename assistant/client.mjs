import { sources, faqAnswer, knowledgeVersion } from './knowledge.mjs';
import { readEvents } from './protocol.mjs';
const config = { apiUrl: __ASSISTANT_API_URL__ };

const copy = {
  en: {
    launch:'Ask my AI', launchLabel:"Open DiRen's AI assistant", title:"DiRen's AI assistant", subtitle:'A conversation, with sources.',
    intro:'Get to know the person behind the projects.', introText:'Ask about my work, explore my experience, or bring a role you have in mind.',
    ask:'Ask about me', job:'Compare a role', close:'Close assistant', clear:'Start fresh', send:'Send', stop:'Stop',
    placeholder:'What would you like to know about me?', jobPlaceholder:'Paste the job description here (60–6,000 characters)…',
    inputLabel:'Your question', jobLabel:'Job description', greeting:"Hi, I'm DiRen's AI assistant. I can introduce my background and projects using the information DiRen has confirmed. What would you like to explore?",
    online:'AI connected', faq:'FAQ mode', checking:'Connecting…', faqNote:'You’re browsing confirmed profile answers. Live AI is currently unavailable.', retry:'Try AI again', liveSite:'Open live AI ↗', localNote:'This local file uses confirmed FAQs. Open the published site to chat with the live AI.',
    loading:'Looking through my profile…', comparing:'Comparing the role with my profile…', completed:'Answer complete.', stopped:'Response stopped.',
    source:'Sources', verified:'Profile confirmed', you:'You', ai:'DiRen · AI', faqTag:'Confirmed FAQ', aiTag:'AI response',
    privacy:'This page keeps no chat history after refresh. Online messages and job descriptions are processed by Cloudflare; this app does not save them in a database. Do not include confidential information.',
    privacyLabel:'About this conversation', footnote:'AI assistant · Please confirm important details with me.',
    email:'Email me', phone:'Call me', jobUnavailable:'Live AI is needed for a role comparison. Profile questions remain available below.',
    short:'Please include at least 60 characters of the job description.', empty:'Write a question first.', long:'Your message is too long.',
    failed:'The live answer could not be completed. Here is the available profile information instead.',
    jobSent:'Compare this role with my profile:', remaining:'characters', nearLimit:'Start a fresh conversation to keep exploring.',
    heroLabel:'A NEW WAY TO SAY HELLO', heroTitle:'Curious about my work?', heroText:'Ask my AI assistant about my projects, skills or a role you’re hiring for.', heroButton:'Talk to my AI',
    prompts:['Introduce yourself','Tell me about your RAG project','When can you start?','Compare a job description'],
    promptQuestions:['Introduce yourself.','Tell me about your independently developed RAG project and its challenges.','When can you start and how often can you work onsite?']
  },
  zh: {
    launch:'问问我的 AI',launchLabel:'打开 DiRen 的 AI 助手',title:'DiRen 的 AI 助手',subtitle:'每段介绍，都有依据。',
    intro:'从对话里，认识项目背后的我。',introText:'了解我的项目与经历，也可以带着你正在招聘的职位来聊。',
    ask:'了解我',job:'职位对照',close:'关闭助手',clear:'重新开始',send:'发送',stop:'停止',
    placeholder:'你想了解我的哪些方面？',jobPlaceholder:'在这里粘贴职位描述（60–6,000 字符）…',inputLabel:'你的问题',jobLabel:'职位描述',
    greeting:'你好，我是 DiRen 的 AI 助手。我会依据 DiRen 确认过的资料，用第一人称介绍我的背景和项目。你想从哪里开始了解？',
    online:'AI 已连接',faq:'常见问答模式',checking:'正在连接…',faqNote:'当前提供已确认的个人资料，在线 AI 暂不可用。',retry:'重试连接 AI',liveSite:'打开在线 AI ↗',localNote:'当前为本地常见问答。请打开已发布主页，与在线 AI 对话。',
    loading:'正在查阅我的资料…',comparing:'正在对照职位要求与我的经历…',completed:'回答已完成。',stopped:'已停止回答。',
    source:'回答依据',verified:'资料确认于',you:'你',ai:'DiRen · AI',faqTag:'已确认的常见问答',aiTag:'AI 回答',
    privacy:'对话仅保留在当前页面，刷新后不恢复。在线提问和职位描述会由 Cloudflare 处理；本应用不将它们保存到数据库。请勿提交机密信息。',privacyLabel:'关于本次对话',footnote:'AI 助手 · 重要信息请与我本人确认。',
    email:'给我发邮件',phone:'联系我',jobUnavailable:'职位对照需要在线 AI，你仍可以通过下方入口了解我的资料。',
    short:'请至少粘贴 60 个字符的职位描述。',empty:'请先写下你的问题。',long:'输入内容超过长度限制。',
    failed:'在线回答未能完成，下面为你提供已有的个人资料。',jobSent:'请对照这份职位描述：',remaining:'字符',nearLimit:'请重新开始一段对话，继续了解我。',
    heroLabel:'用对话，打个招呼',heroTitle:'想进一步了解我的工作？',heroText:'向我的 AI 助手提问，了解项目、技术栈，或对照你的招聘需求。',heroButton:'和我的 AI 聊聊',
    prompts:['介绍一下你自己','讲讲你的 RAG 项目','什么时候可以到岗？','对照一份职位描述'],
    promptQuestions:['介绍一下你自己。','介绍你独立开发的 RAG 项目，以及遇到过的难点。','你什么时候可以到岗，每周可以现场工作几天？']
  }
};
const language = () => document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
let uiLang = language(), mode = 'chat', connection = 'checking', busy = false, controller, healthController;
let transcript = [], turns = 0, lastFocus, generation = 0;
const t = key => copy[uiLang][key];
const cleanAnswer = text => text.replace(/^\s+/, '').replace(/\*\*([^*\n]+)\*\*/g, '$1');
const $ = sel => document.querySelector(sel);
const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-5 3v-7.5A7.5 7.5 0 0 1 10.5 7H13"/><path d="m18 2 .9 3.1L22 6l-3.1.9L18 10l-.9-3.1L14 6l3.1-.9Z"/></svg>';

const entrance = document.createElement('section');
entrance.className = 'assistant-entrance';
entrance.setAttribute('aria-labelledby','assistant-entrance-title');
entrance.innerHTML = `<div class="assistant-entrance-icon" aria-hidden="true">${icon}</div><div class="assistant-entrance-copy"><span class="assistant-kicker" data-chat-copy="heroLabel"></span><h2 id="assistant-entrance-title" data-chat-copy="heroTitle"></h2><p data-chat-copy="heroText"></p></div><button class="assistant-open assistant-entrance-button press" type="button"><span data-chat-copy="heroButton"></span><span aria-hidden="true">↗</span></button>`;
$('.tag-strip').before(entrance);
const shell = document.createElement('div');
shell.className = 'assistant-shell';
shell.innerHTML = `
<button class="assistant-launcher assistant-open" type="button" aria-controls="profile-assistant" aria-haspopup="dialog">${icon}<span data-chat-copy="launch"></span><span class="assistant-launch-dot" aria-hidden="true"></span></button>
<dialog class="assistant-dialog" id="profile-assistant" aria-labelledby="assistant-title" aria-describedby="assistant-subtitle">
  <header class="assistant-header"><span class="assistant-avatar" aria-hidden="true">ds<span>✦</span></span><div class="assistant-header-copy"><h2 id="assistant-title" data-chat-copy="title"></h2><p id="assistant-subtitle" data-chat-copy="subtitle"></p></div><button class="assistant-icon-button assistant-clear" type="button">↺</button><button class="assistant-icon-button assistant-close" type="button">×</button></header>
  <div class="assistant-mode" role="group"><button type="button" data-chat-mode="chat" aria-pressed="true" data-chat-copy="ask"></button><button type="button" data-chat-mode="job" aria-pressed="false" data-chat-copy="job"></button></div>
  <div class="assistant-status"><span class="assistant-connection"><i aria-hidden="true"></i><span></span></span><button class="assistant-retry" type="button" data-chat-copy="retry"></button></div>
  <p class="assistant-faq-note"><span data-chat-copy="faqNote"></span> <a class="assistant-live-site" href="https://shendiren-netizen.github.io/?chat=open" hidden></a></p>
  <div class="assistant-messages" role="log" aria-live="off" tabindex="0"></div>
  <div class="assistant-suggestions"></div>
  <form class="assistant-composer"><label class="sr-only" for="assistant-input"></label><textarea id="assistant-input" rows="2" maxlength="1000" autocomplete="off" spellcheck="true"></textarea><div class="assistant-composer-bottom"><span class="assistant-counter" aria-hidden="true"></span><span class="assistant-form-error" role="alert"></span><button class="assistant-send" type="submit"><span data-chat-copy="send"></span><span aria-hidden="true">↗</span></button></div></form>
  <footer class="assistant-footer"><p data-chat-copy="footnote"></p><details class="assistant-privacy"><summary data-chat-copy="privacyLabel"></summary><p data-chat-copy="privacy"></p></details><div><a href="mailto:shendiren@gmail.com" data-chat-copy="email"></a><span aria-hidden="true">·</span><a href="tel:+61415877599" data-chat-copy="phone"></a></div></footer>
  <span class="sr-only assistant-announcement" aria-live="polite" role="status"></span>
</dialog>`;
document.body.append(shell);
const dialog = $('.assistant-dialog'), input = $('#assistant-input'), log = $('.assistant-messages'), send = $('.assistant-send');
const scrollToEnd = (force=false) => { if(force || log.scrollHeight-log.scrollTop-log.clientHeight < 130) log.scrollTop=log.scrollHeight; };
function textNode(tag, className, text) { const el=document.createElement(tag); if(className)el.className=className; el.textContent=text; return el; }
function renderSources(article, ids, lang) {
  article.querySelector('.assistant-sources')?.remove();
  const valid = [...new Set(ids)].map(id=>sources.find(s=>s.id===id)).filter(Boolean);
  if (!valid.length) return;
  const details = document.createElement('details'); details.className='assistant-sources';
  details.append(textNode('summary','',`${copy[lang].source} · ${valid.length}`));
  for(const source of valid) {
    const block=document.createElement('div'); block.className='assistant-source';
    const link=textNode('a','',`[${source.id}] ${source.title[lang]} ↗`); link.href=source.href; link.addEventListener('click',()=>dialog.close());
    block.append(link,textNode('p','',source.text[lang])); details.append(block);
  }
  details.append(textNode('small','',`${copy[lang].verified} ${knowledgeVersion}`)); article.append(details);
}
function addMessage(role,text,lang,tag) {
  const article=document.createElement('article');article.className=`assistant-message assistant-message-${role}`;article.lang=lang==='zh'?'zh-CN':'en';
  article.append(textNode('h3','assistant-message-label',role==='user'?copy[lang].you:copy[lang].ai));
  if(tag)article.append(textNode('span','assistant-message-tag',tag));
  const content=textNode('div','assistant-message-text',text);article.append(content);log.append(article);scrollToEnd(true);
  return {article,content};
}
function suggestions() {
  const wrap=$('.assistant-suggestions');wrap.replaceChildren();
  copy[uiLang].prompts.forEach((label,index)=>{
    const button=textNode('button','',label);button.type='button';button.disabled=busy;
    button.addEventListener('click',()=>{if(index===3){setMode('job');input.focus();}else{setMode('chat');input.value=copy[uiLang].promptQuestions[index];updateCount();submit();}});wrap.append(button);
  });
}
function updateCount() { $('.assistant-counter').textContent=`${input.value.length.toLocaleString()} / ${mode==='job'?'6,000':'1,000'}`; }
function renderConnection() {
  $('.assistant-connection').dataset.state=connection;
  $('.assistant-connection>span').textContent=t(connection==='online'?'online':connection==='checking'?'checking':'faq');
  $('.assistant-retry').hidden=connection!=='faq'||!config.apiUrl;
  $('.assistant-faq-note').hidden=connection!=='faq';
  const local = location.protocol==='file:' && !!config.apiUrl;
  $('.assistant-faq-note [data-chat-copy]').textContent=t(local?'localNote':'faqNote');
  $('.assistant-live-site').hidden=!local;$('.assistant-live-site').textContent=t('liveSite');
}
function setBusy(value) {
  busy=value;input.readOnly=value;
  send.querySelector('[data-chat-copy]').textContent=t(value?'stop':'send');
  send.querySelector('[aria-hidden]').textContent=value?'■':'↗';
  send.setAttribute('aria-label',t(value?'stop':'send'));
  dialog.querySelectorAll('[data-chat-mode]').forEach(b=>b.disabled=value);
  suggestions();
}
function setMode(next) {
  if(busy)return;
  mode=next;input.value='';$('.assistant-form-error').textContent='';
  dialog.querySelectorAll('[data-chat-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chatMode===mode)));
  input.maxLength=mode==='job'?6000:1000;input.placeholder=t(mode==='job'?'jobPlaceholder':'placeholder');
  $('.assistant-composer label').textContent=t(mode==='job'?'jobLabel':'inputLabel');updateCount();
}
function localize() {
  uiLang=language();
  document.querySelectorAll('[data-chat-copy]').forEach(el=>el.textContent=t(el.dataset.chatCopy));
  $('.assistant-launcher').setAttribute('aria-label',t('launchLabel'));
  $('.assistant-close').setAttribute('aria-label',t('close'));$('.assistant-clear').setAttribute('aria-label',t('clear'));
  $('.assistant-mode').setAttribute('aria-label',`${t('ask')} / ${t('job')}`);
  input.placeholder=t(mode==='job'?'jobPlaceholder':'placeholder');$('.assistant-composer label').textContent=t(mode==='job'?'jobLabel':'inputLabel');
  if(!turns&&!busy){log.replaceChildren();addMessage('assistant',t('greeting'),uiLang);}
  setBusy(busy);renderConnection();updateCount();
}
function open() {
  if(dialog.open)return;lastFocus=document.activeElement;dialog.showModal();document.body.classList.add('assistant-is-open');
  $('.assistant-launcher').setAttribute('aria-expanded','true');input.focus({preventScroll:true});
}
document.querySelectorAll('.assistant-open').forEach(b=>b.addEventListener('click',open));
dialog.querySelectorAll('[data-chat-mode]').forEach(button=>button.addEventListener('click',()=>{setMode(button.dataset.chatMode);input.focus();}));
$('.assistant-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('assistant-is-open');$('.assistant-launcher').setAttribute('aria-expanded','false');lastFocus?.focus({preventScroll:true});});
$('.assistant-clear').addEventListener('click',()=>{
  generation++;controller?.abort();transcript=[];turns=0;log.replaceChildren();setBusy(false);setMode('chat');addMessage('assistant',t('greeting'),uiLang);input.focus();
});
input.addEventListener('input',()=>{updateCount();$('.assistant-form-error').textContent='';});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&mode==='chat'){e.preventDefault();if(!busy)submit();}});
$('.assistant-composer').addEventListener('submit',e=>{e.preventDefault();if(busy)controller?.abort();else submit();});
document.addEventListener('diren-language-change',localize);

async function checkConnection() {
  healthController?.abort();
  if(!config.apiUrl){connection='faq';renderConnection();return;}
  connection='checking';renderConnection();const health=new AbortController();healthController=health;
  const timer=setTimeout(()=>health.abort(),5000);
  try{
    const url=new URL(config.apiUrl);url.pathname=url.pathname.replace(/\/chat\/?$/,'/health');
    const response=await fetch(url,{signal:health.signal,credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store'});
    const status=await response.json();if(health!==healthController)return;connection=response.ok&&status.status==='ready'?'online':'faq';
  }catch{if(health===healthController)connection='faq';}finally{clearTimeout(timer);if(health===healthController)renderConnection();}
}
$('.assistant-retry').addEventListener('click',checkConnection);
function fallback(reply,question,lang,kind,reason=false) {
  const result=faqAnswer(question,lang,kind);
  reply.article.querySelector('.assistant-message-tag')?.remove();
  reply.article.insertBefore(textNode('span','assistant-message-tag',copy[lang].faqTag),reply.content);
  reply.content.textContent=(reason?copy[lang].failed+'\n\n':'')+result.text;
  renderSources(reply.article,result.sourceIds,lang);scrollToEnd(true);
}
async function submit() {
  if(busy)return;
  const value=input.value.trim(),kind=mode;
  if(!value){$('.assistant-form-error').textContent=t('empty');return;}
  if(kind==='job'&&value.length<60){$('.assistant-form-error').textContent=t('short');return;}
  if(value.length>(kind==='job'?6000:1000)){$('.assistant-form-error').textContent=t('long');return;}
  if(turns>=30){$('.assistant-form-error').textContent=t('nearLimit');return;}
  const lang=kind==='job'?uiLang:/\p{Script=Han}/u.test(value)?'zh':/[a-z]/i.test(value)?'en':uiLang;
  const current=++generation;turns++;
  const question=kind==='job'?(lang==='zh'?'请将此职位要求与我的资料逐项对照。':'Compare this job description with my confirmed profile.'):value;
  addMessage('user',kind==='job'?copy[lang].jobSent+'\n'+value:value,lang);
  const reply=addMessage('assistant',copy[lang][kind==='job'?'comparing':'loading'],lang,connection==='online'?copy[lang].aiTag:copy[lang].faqTag);
  input.value='';updateCount();$('.assistant-form-error').textContent='';
  if(connection!=='online'){fallback(reply,question,lang,kind);$('.assistant-announcement').textContent=copy[lang].completed;return;}
  const activeController=new AbortController();controller=activeController;const timer=setTimeout(()=>activeController.abort('timeout'),50000);setBusy(true);let answer='';
  try{
    const response=await fetch(config.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',referrerPolicy:'no-referrer',signal:activeController.signal,
      body:JSON.stringify({question,lang,mode:kind,job:kind==='job'?value:'',history:kind==='job'?[]:transcript.slice(-6)})});
    if(!response.ok||!response.body||!response.headers.get('content-type')?.includes('text/event-stream'))throw new Error('AI_UNAVAILABLE');
    let complete=false;
    for await(const event of readEvents(response.body,activeController.signal)){
      if(current!==generation)return;
      const data=JSON.parse(event.data);
      if(event.event==='error')throw new Error('AI_UNAVAILABLE');
      if(event.event==='delta'){
        if(typeof data.text!=='string'||answer.length+data.text.length>7000)throw new Error('INVALID_STREAM');
        answer+=data.text;reply.content.textContent=cleanAnswer(answer);scrollToEnd();
      }
      if(event.event==='done'){
        if(!answer.trim()||!Array.isArray(data.sourceIds)||!data.sourceIds.length||data.sourceIds.some(id=>!sources.some(s=>s.id===id)))throw new Error('UNSUPPORTED_SOURCES');
        renderSources(reply.article,data.sourceIds,lang);complete=true;
      }
    }
    if(!complete)throw new Error('INCOMPLETE');
    if(kind==='chat'){transcript.push({role:'user',content:question},{role:'assistant',content:answer.slice(0,1500)});transcript=transcript.slice(-6);}
    $('.assistant-announcement').textContent=copy[lang].completed;
  }catch{
    if(current!==generation)return;
    if(activeController.signal.aborted&&activeController.signal.reason!=='timeout'){
      reply.content.textContent=copy[lang].stopped;reply.article.querySelector('.assistant-message-tag')?.remove();
      $('.assistant-announcement').textContent=copy[lang].stopped;
    }else{connection='faq';renderConnection();fallback(reply,question,lang,kind,true);$('.assistant-announcement').textContent=copy[lang].completed;}
  }finally{clearTimeout(timer);if(current===generation)setBusy(false);}
}
// No localStorage/sessionStorage, cookies, analytics or transcript database.
window.addEventListener('pagehide',()=>{controller?.abort();healthController?.abort();transcript=[];input.value='';log.replaceChildren();turns=0;});
window.addEventListener('pageshow',e=>{if(e.persisted){setBusy(false);localize();}});
localize();checkConnection();
if(new URLSearchParams(location.search).get('chat')==='open')open();
