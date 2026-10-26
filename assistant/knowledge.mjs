// Public facts approved by DiRen. No model-generated career claims belong here.
export const knowledgeVersion = '2026-10-26';
export const sources = [
  {
    id: 'profile', href: '#about',
    title: { en: 'Profile & education', zh: '个人介绍与教育背景' },
    text: {
      en: "I'm DiRen Shen, based in Sydney, NSW, Australia. I graduated from the University of Sydney with a Master of Computer Science in July 2026. I'm seeking an AI / LLM application engineering internship and am interested in LLM applications and agent engineering. My practical work includes AI application prototypes and full stack development.",
      zh: '我是 DiRen Shen，居住在澳大利亚新南威尔士州悉尼。2026 年 7 月毕业于悉尼大学，获得计算机科学硕士学位。我正在寻找 AI / LLM 应用工程实习，关注大模型应用和 Agent 工程，有 AI 应用原型及全栈开发实践。'
    }
  },
  {
    id: 'skills', href: '#skills',
    title: { en: 'Technical skills', zh: '技术栈' },
    text: {
      en: 'My languages include Java, JavaScript, SQL and C++; I have used Python and TypeScript in project work. AI application skills include RAG, embeddings, prompt design, OpenAI Python SDK, source citations and basic QA evaluation. Backend/data: Spring Boot, FastAPI, RESTful APIs, PostgreSQL, MongoDB, pgvector and SQLAlchemy. Frontend/tools: React, Vue.js, Next.js, HTML/CSS, SSE, Git, Docker Compose, Maven and Gradle. No proficiency ratings, certifications or years of professional experience have been provided.',
      zh: '编程语言包括 Java、JavaScript、SQL 和 C++；Python 与 TypeScript 用于项目实践。AI 应用技术包括 RAG、Embeddings、提示词设计、OpenAI Python SDK、来源引用和基础问答评估。后端与数据：Spring Boot、FastAPI、RESTful API、PostgreSQL、MongoDB、pgvector、SQLAlchemy。前端与工具：React、Vue.js、Next.js、HTML/CSS、SSE、Git、Docker Compose、Maven、Gradle。尚未提供技能评级、认证或职业工作年限。'
    }
  },
  {
    id: 'rag', href: '#projects',
    title: { en: 'Enterprise knowledge base RAG', zh: '企业知识库 RAG 项目' },
    text: {
      en: 'I independently developed an enterprise knowledge base RAG application prototype. Stack: Next.js, TypeScript, Python, FastAPI, PostgreSQL, pgvector and OpenAI Python SDK. The pipeline supports PDF, DOCX, Markdown and TXT uploads, text extraction, overlapping chunks, embeddings and vector storage. It implements cosine-distance Top-K retrieval, query rewriting and context assembly. Answers include document names, locations and supporting passages. Features include SSE streaming chat, message history, document selection, feedback, user authentication and ownership-based access controls. I added keyword hit-rate, citation-count and response-time evaluation, Docker Compose setup and a local demo fallback without model credentials. This is a prototype; no production deployment, customer numbers, scale or evaluation scores are supplied.',
      zh: '我独立开发了企业知识库 RAG 应用原型，技术栈为 Next.js、TypeScript、Python、FastAPI、PostgreSQL、pgvector 和 OpenAI Python SDK。支持 PDF、DOCX、Markdown、TXT 上传、文本提取、重叠分块、嵌入和向量存储，实现余弦距离 Top-K 检索、查询改写及上下文组装。回答附带文档名称、位置和支持段落。功能包括 SSE 流式聊天、消息历史、文档选择、反馈、用户认证及基于归属的访问控制。加入了关键词命中率、引用数量和响应时间评估，提供 Docker Compose 启动以及无需模型凭据的本地演示回退。这是应用原型，尚未提供生产部署、客户数量、规模或评估分数。'
    }
  },
  {
    id: 'rag-challenges', href: '#projects',
    title: { en: 'RAG challenges & confirmed work', zh: 'RAG 难点与已确认实践' },
    text: {
      en: 'In the RAG project I encountered irrelevant retrieval results and answers that lacked grounding. I tried retrieval adjustments and added source citations and rules for insufficient evidence. The exact chunk sizes, Top-K values, specific adjustments, before/after measurements and whether these issues were fully resolved have not been confirmed. I cannot yet provide confirmed improvement figures or claim these issues were fully resolved.',
      zh: '在 RAG 项目中，我遇到过检索结果不相关和回答缺乏依据的问题。我尝试调整检索方式，并加入来源引用及资料不足时的回答约束。具体分块尺寸、Top-K 数值、调整细节、修改前后测量结果及问题是否完全解决尚未确认，目前不能提供已验证的改进数字，也不能声称问题已彻底解决。'
    }
  },
  {
    id: 'medical', href: '#projects',
    title: { en: 'Medical AI chatbot prototype', zh: '医疗 AI 聊天机器人原型' },
    text: {
      en: 'I designed a chatbot prototype for basic health information queries, using conversation logic and prompt-based interactions. I structured backend input processing, response generation and component data flow, designed intuitive interactions and demonstrated the system to non-technical users. My resume does not specify its stack or whether it was independently developed. No clinical validation, medical deployment, diagnostic capability or performance results have been provided.',
      zh: '我设计了面向基础健康信息查询的聊天机器人原型，使用对话逻辑与提示词交互；梳理后端输入处理、回答生成和组件数据流，设计直观交互，并向非技术用户演示系统。简历未注明该项目的具体技术栈，也未确认是否独立开发。尚未提供临床验证、医疗部署、诊断能力或性能结果。'
    }
  },
  {
    id: 'renovation', href: '#projects',
    title: { en: '2D renovation team application', zh: '2D 装修设计团队项目' },
    text: {
      en: 'I contributed to a team web application for custom space drawing, 2D layouts, area calculation and renovation cost estimation. Stack: React, Java, Spring Boot and RESTful APIs. I connected React interactions to Spring Boot APIs and implemented input-driven cost estimation. I collaborated through sprint planning and technical discussions. This was a team project; I do not claim sole ownership of the platform.',
      zh: '我参与了支持自定义空间绘制、2D 布局、面积计算和装修费用估算的团队 Web 应用，技术栈为 React、Java、Spring Boot 和 RESTful API。我连接 React 交互与 Spring Boot API，实现基于输入的费用估算，并参与迭代计划和技术讨论。这是团队项目，不应声称整个平台由我独立完成。'
    }
  },
  {
    id: 'availability', href: '#direction',
    title: { en: 'Availability & languages', zh: '到岗时间与语言' },
    text: {
      en: 'As confirmed on 26 October 2026, I am available to start immediately and continue an internship through June 2027, with onsite availability in Sydney at least four days per week. My Mandarin is native and my English is fluent. This availability should be reconfirmed directly if dates have passed. Salary expectations, visa status and work rights have not been provided; please contact me to confirm them.',
      zh: '截至 2026 年 10 月 26 日确认，我可以立即到岗，实习至 2027 年 6 月，每周可在悉尼现场工作至少四天。普通话为母语，英语流利。如上述日期已过，请直接联系我重新确认。尚未提供薪资期望、签证状态和工作权利，请联系我确认。'
    }
  },
  {
    id: 'contact', href: '#direction',
    title: { en: 'Contact', zh: '联系方式' },
    text: { en: 'You can reach me at shendiren@gmail.com or +61 415 877 599. I am based in Sydney, NSW, Australia.', zh: '可以通过 shendiren@gmail.com 或 +61 415 877 599 联系我。我居住在澳大利亚新南威尔士州悉尼。' }
  },
  {
    id: 'interests', href: '#interests',
    title: { en: 'Beyond code', zh: '代码之外' },
    text: { en: 'Outside of development, I enjoy fitness and climbing.', zh: '开发之外，我喜欢健身和攀岩。' }
  }
];

const matchers = [
  ['rag-challenges', /challenge|difficult|problem|ground|hallucinat|irrelevant|难点|困难|问题|幻觉|不相关|依据|调优|改进/iu],
  ['rag', /\brag\b|retriev|knowledge|pgvector|知识库|检索|向量|分块/iu],
  ['medical', /medical|health|医[疗学]|健康/iu],
  ['renovation', /renovat|cost estimat|2d|team|装修|估算|团队/iu],
  ['availability', /availab|start|onsite|language|mandarin|english|到岗|入职|实习时间|几天|语言|英文|英语|中文|普通话/iu],
  ['contact', /contact|email|phone|reach|联系|邮箱|电话/iu],
  ['skills', /skill|stack|python|java|react|typescript|技术栈|技能|编程/iu],
  ['interests', /hobb|interest|fitness|climb|健身|攀岩|爱好/iu],
  ['profile', /introduc|education|degree|graduat|university|who are|about you|介绍|学历|毕业|大学|你是谁/iu]
];
export function faqAnswer(question, lang = 'en', mode = 'chat') {
  if (mode === 'job') return { text: lang === 'zh' ? '职位对照需要在线 AI，目前不可用。你可以先查看我的项目、技术栈和到岗时间，或通过 shendiren@gmail.com 联系我讨论岗位。' : 'Job comparison needs the online AI, which is currently unavailable. You can review my projects, skills and availability, or email shendiren@gmail.com to discuss the role.', sourceIds: ['skills', 'contact'] };
  if (/salary|visa|work rights|sponsor|gpa|\bage\b|薪资|薪水|工资|签证|工签|工作权|担保|绩点|年龄/iu.test(question)) return { text: lang === 'zh' ? '我的公开资料尚未提供这项信息，请通过 shendiren@gmail.com 联系我确认。' : 'This information is not included in my public profile. Please email shendiren@gmail.com to confirm it with me.', sourceIds: ['contact'] };
  let id = matchers.find(([, pattern]) => pattern.test(question))?.[0];
  if (!id && /project|项目/iu.test(question)) return { text: ['rag','medical','renovation'].map(id => sources.find(s=>s.id===id).text[lang]).join('\n\n'), sourceIds: ['rag','medical','renovation'] };
  if (!id) return { text: lang === 'zh' ? '常见问答目前只能提供已确认的个人资料。你可以问我的学历、技术栈、RAG 项目、其他项目、到岗时间或联系方式；资料未涵盖的细节请直接联系我。' : 'FAQ mode provides my confirmed public profile. Ask about my education, skills, RAG project, other projects, availability or contact details. Please contact me directly for details not covered here.', sourceIds: ['profile','contact'] };
  const source = sources.find(s=>s.id===id);
  return { text: source.text[lang], sourceIds: [id] };
}
