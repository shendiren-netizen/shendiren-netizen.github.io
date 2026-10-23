(() => {
  const translations = {
  "en": {
    "brandSubtitle": "Personal site",
    "home": "Home",
    "about": "About",
    "interests": "Interests",
    "seekingAI": "Seeking AI roles",
    "interactiveMode": "Interactive mode",
    "motionOn": "Motion on",
    "welcome": "Welcome to my little universe",
    "hello": "Hello there!",
    "heroLead": "I'm",
    "introPrefix": "Studying computer science at",
    "university": "the University of Sydney",
    "introSuffix": ".",
    "introAI": "Looking for my next opportunity in AI.",
    "introHobby": "Off screen, I enjoy working out and climbing.",
    "meetMe": "Get to know me",
    "gladYouAreHere": "Glad you're here!",
    "quickCaption": "Learn · Explore · Move",
    "identity": "CS student / Exploring AI",
    "artNote": "A little code. A little movement. A little curiosity.",
    "playgroundTitle": "A little spark for your curiosity.",
    "hintDesktop": "Move your mouse to explore, or spark it up.",
    "sparkButton": "Spark it up",
    "keywords": "My keywords",
    "cs": "Computer science",
    "aiFocus": "AI opportunities",
    "fitness": "Fitness",
    "climbing": "Climbing",
    "aboutIndex": "01 / ABOUT ME",
    "aboutHeading1": "Exploring code,",
    "aboutHeading2": "always moving ",
    "up": "up.",
    "niceToMeetYou": "NICE TO MEET YOU",
    "aboutIntro": "I'm diren shen,",
    "aboutStudy": "a computer science student at the University of Sydney.",
    "aboutAI": "I'm looking for opportunities in AI.",
    "aboutHobbies": "Outside of class, I enjoy fitness and climbing.",
    "interestsIndex": "02 / MY INTERESTS",
    "interestsHeading": "Beyond the screen",
    "keepMoving": "Keep life in motion ↙",
    "fitnessHeading": "I like working out.",
    "fitnessDescription": "One of my interests outside of class.",
    "climbingHeading": "And climbing, too.",
    "climbingDescription": "Another interest, up on the climbing wall.",
    "nextStop": "NEXT STOP / AI",
    "directionPrefix": "Looking for opportunities in",
    "directionSuffix": ".",
    "directionStudy": "Computer science student · University of Sydney",
    "footerKeywords": "Computer science · Fitness · Climbing",
    "backTop": "Back to top ↑",
    "skip": "Skip to content",
    "navLabel": "Main navigation",
    "brandLabel": "diren shen, back to home",
    "quickLinksLabel": "Explore this page",
    "csLinkLabel": "Explore my computer science studies",
    "aiLinkLabel": "Explore my interest in AI opportunities",
    "hobbyLinkLabel": "Explore my fitness and climbing interests",
    "artLabel": "Original DS computer character in a blue frame with yellow tape and code and fitness stickers",
    "keywordsLabel": "My keywords",
    "backTopLabel": "Back to top",
    "motionLabel": "Interactive effects",
    "hobbiesTooltip": "Fitness & climbing",
    "pageTitle": "diren shen · Personal site",
    "pageDescription": "Meet diren shen, a computer science student at the University of Sydney seeking opportunities in AI, with an interest in fitness and climbing.",
    "motionSystem": "System setting",
    "motionOff": "Motion off",
    "motionTitle": "Toggle particles and animations",
    "motionReducedTitle": "Your system prefers reduced motion. Animations are reduced automatically.",
    "hintReduced": "Reduced motion is enabled. Enjoy a calmer page.",
    "hintPaused": "Effects are paused. Turn them on whenever you like.",
    "hintMobile": "Tap “Spark it up” for a little surprise.",
    "sparked": "A little spark, just for you!"
  },
  "zh": {
    "brandSubtitle": "个人主页",
    "home": "首页",
    "about": "关于我",
    "interests": "兴趣",
    "seekingAI": "寻找 AI 工作",
    "interactiveMode": "互动模式",
    "motionOn": "动效开启",
    "welcome": "欢迎来到我的小小宇宙",
    "hello": "你好呀！",
    "heroLead": "我是",
    "introPrefix": "在",
    "university": "悉尼大学",
    "introSuffix": "读计算机科学，",
    "introAI": "想把对 AI 的兴趣，变成下一份工作。",
    "introHobby": "也喜欢健身，和向上攀岩。",
    "meetMe": "认识一下我",
    "gladYouAreHere": "很高兴在这里遇见你",
    "quickCaption": "学习 · 探索 · 生活",
    "identity": "CS 学生 / AI 探索中",
    "artNote": "一点代码，一点运动，一点好奇心。",
    "playgroundTitle": "给好奇心，一点回响。",
    "hintDesktop": "移动鼠标探索粒子，或点击右侧按钮",
    "sparkButton": "点燃灵感",
    "keywords": "我的关键词",
    "cs": "计算机科学",
    "aiFocus": "AI 方向",
    "fitness": "健身",
    "climbing": "攀岩",
    "aboutIndex": "01 / 关于我",
    "aboutHeading1": "从代码里探索，",
    "aboutHeading2": "也在生活里",
    "up": "向上。",
    "niceToMeetYou": "很高兴认识你",
    "aboutIntro": "我是 diren shen，",
    "aboutStudy": "在悉尼大学学习计算机科学。",
    "aboutAI": "我希望找到 AI 方向的工作。",
    "aboutHobbies": "学习之外，我喜欢健身和攀岩。",
    "interestsIndex": "02 / 我的兴趣",
    "interestsHeading": "不止于屏幕之内",
    "keepMoving": "生活也要动起来 ↙",
    "fitnessHeading": "喜欢健身。",
    "fitnessDescription": "我的课外兴趣之一。",
    "climbingHeading": "也喜欢攀岩。",
    "climbingDescription": "另一份兴趣，在岩壁之上。",
    "nextStop": "下一站 / AI",
    "directionPrefix": "寻找",
    "directionSuffix": "方向的工作机会。",
    "directionStudy": "计算机科学在读 · 悉尼大学",
    "footerKeywords": "计算机科学 · 健身 · 攀岩",
    "backTop": "回到顶部 ↑",
    "skip": "跳到正文",
    "navLabel": "主导航",
    "brandLabel": "diren shen，回到首页",
    "quickLinksLabel": "快速探索",
    "csLinkLabel": "了解我的计算机科学学习方向",
    "aiLinkLabel": "了解我的 AI 求职方向",
    "hobbyLinkLabel": "了解我的健身和攀岩兴趣",
    "artLabel": "原创 DS 电脑角色插画，蓝色画框配黄色胶带，周围有代码和运动贴纸",
    "keywordsLabel": "我的关键词",
    "backTopLabel": "回到顶部",
    "motionLabel": "互动动效",
    "hobbiesTooltip": "健身与攀岩",
    "pageTitle": "diren shen · 个人主页",
    "pageDescription": "diren shen 的个人主页。在悉尼大学学习计算机科学，寻找 AI 方向的工作机会，喜欢健身与攀岩。",
    "motionSystem": "跟随系统",
    "motionOff": "动效关闭",
    "motionTitle": "切换粒子与动画",
    "motionReducedTitle": "系统已开启“减少动态效果”，本站会自动减弱动画",
    "hintReduced": "已跟随系统减少动态效果，安心浏览",
    "hintPaused": "动效已暂停，随时可以重新开启",
    "hintMobile": "轻触「点燃灵感」，收获一点惊喜",
    "sparked": "灵感已点燃！"
  }
};
  const storageKey = 'diren.language.v1';
  let language = 'en';
  try { if (localStorage.getItem(storageKey) === 'zh') language = 'zh'; } catch {}

  function t(key) { return translations[language][key] ?? translations.en[key] ?? key; }
  function setLanguage(next, persist = true) {
    if (next !== 'en' && next !== 'zh') return;
    language = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    for (const attribute of ['aria-label', 'data-tooltip', 'title', 'content']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    document.title = t('pageTitle');
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    if (persist) {
      try { localStorage.setItem(storageKey, language); } catch {}
    }
    document.dispatchEvent(new CustomEvent('diren-language-change', { detail: { language } }));
  }
  window.siteI18n = Object.freeze({ t, setLanguage, get language() { return language; } });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });
  document.querySelector('.language-switch').hidden = false;
  setLanguage(language, false);
})();
