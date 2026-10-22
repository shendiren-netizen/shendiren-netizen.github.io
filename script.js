(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedEffects = true;
  try { savedEffects = localStorage.getItem('diren.effects.v1') !== 'off'; } catch {}
  document.documentElement.dataset.effects = motionPreference.matches ? 'reduced' : savedEffects ? 'on' : 'off';
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = ['top', 'about', 'interests'].map(id => document.getElementById(id));
  const progress = document.querySelector('.reading-progress > span');
  let queued = false;

  function updateNavigation() {
    let current = 'top';
    for (const section of sections) {
      if (section.getBoundingClientRect().top < 180) current = section.id;
    }
    navLinks.forEach(link => {
      const active = link.hash === '#' + current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
    queued = false;
  }
  function queueNavigation() {
    if (!queued) { queued = true; requestAnimationFrame(updateNavigation); }
  }
  window.addEventListener('scroll', queueNavigation, { passive: true });
  window.addEventListener('resize', queueNavigation, { passive: true });
  updateNavigation();

  // Fonts settle before drawing SVG annotations; local assets work offline too.
  let annotations = [];
  let annotationObserver;
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  const entranceReady = new Promise(resolve => {
    if (!window.gsap || motionPreference.matches) resolve();
    else if (document.documentElement.dataset.effects === 'off') resolve();
    else setTimeout(resolve, 1500);
  });
  Promise.all([ready, entranceReady]).then(() => {
    if (!window.RoughNotation) return;
    const { annotate } = window.RoughNotation;
    const name = annotate(document.querySelector('.name'), {
      type: 'underline', color: '#efca40', strokeWidth: 5, padding: [0, 0, 3, 0],
      iterations: 2, animationDuration: 900, animate: !motionPreference.matches && document.documentElement.dataset.effects !== 'off',
    });
    const highlight = annotate(document.querySelector('.highlight'), {
      type: 'underline', color: '#a3bf8f', strokeWidth: 3, padding: 4,
      iterations: 1, animationDuration: 750, animate: !motionPreference.matches && document.documentElement.dataset.effects !== 'off',
    });
    const ai = annotate(document.querySelector('.ai-annotation'), {
      type: 'circle', color: '#5c7750', strokeWidth: 1.5, padding: 4,
      iterations: 2, animationDuration: 850, animate: !motionPreference.matches && document.documentElement.dataset.effects !== 'off',
    });
    annotations = [name, highlight, ai];
    document.querySelectorAll('.rough-annotation').forEach(svg => svg.setAttribute('aria-hidden', 'true'));
    document.documentElement.classList.add('annotations-ready');
    name.show();
    annotationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const annotation = entry.target.classList.contains('highlight') ? highlight : ai;
        annotation.show();
        annotationObserver.unobserve(entry.target);
      });
    }, { threshold: .8 });
    annotationObserver.observe(document.querySelector('.highlight'));
    annotationObserver.observe(document.querySelector('.ai-annotation'));
  });

  if (!window.gsap) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (document.documentElement.dataset.effects !== 'off') {
    gsap.from('.hero-copy > *', {
      y: 20, opacity: 0, duration: .8, stagger: .075,
      ease: 'power3.out', clearProps: 'transform,opacity',
    });
    gsap.from('.hero-art', {
      y: 18, rotation: -2, opacity: 0, duration: 1, delay: .2,
      ease: 'power3.out', clearProps: 'transform,opacity',
    });
    }
    gsap.to('.code-sticker', { y: -6, rotation: -7, duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.terminal-sticker', { y: 5, rotation: 10, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.bolt-sticker', { y: -4, rotation: -8, duration: 2.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.timeline({ repeat: -1, repeatDelay: 4 })
      .to('.mascot-eyes', { scaleY: .12, transformOrigin: 'center', duration: .1 })
      .to('.mascot-eyes', { scaleY: 1, duration: .14 });

    const reveals = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (document.documentElement.dataset.effects === 'off') { observer.unobserve(entry.target); return; }
          reveals.push(gsap.from(entry.target, {
            y: 25, opacity: 0, duration: .8, ease: 'power3.out', clearProps: 'transform,opacity',
          }));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      reveals.forEach(tween => tween.revert());
    };
  });

  // A restrained response to the pointer keeps the illustration tactile.
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const art = document.querySelector('.hero-art');
    const board = document.querySelector('.art-board');
    const rotateX = gsap.quickTo(board, 'rotationX', { duration: .65, ease: 'power3.out' });
    const rotateY = gsap.quickTo(board, 'rotationY', { duration: .65, ease: 'power3.out' });
    const moveX = gsap.quickTo('.mascot', 'x', { duration: .7, ease: 'power3.out' });
    const moveY = gsap.quickTo('.mascot', 'y', { duration: .7, ease: 'power3.out' });
    function move(event) {
      if (document.documentElement.dataset.effects !== 'on') return;
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      rotateX(-y * 6); rotateY(x * 6);
      moveX(x * 7); moveY(y * 5);
    }
    function reset() { rotateX(0); rotateY(0); moveX(0); moveY(0); }
    art.addEventListener('pointermove', move);
    art.addEventListener('pointerleave', reset);
    return () => {
      art.removeEventListener('pointermove', move);
      art.removeEventListener('pointerleave', reset);
    };
  });
  function refreshAnnotations() {
    annotations.forEach(annotation => annotation.hide());
    annotations.forEach(annotation => {
      annotation.animate = !motionPreference.matches && document.documentElement.dataset.effects !== 'off';
      annotation.show();
    });
  }
  document.addEventListener('diren-effects-change', refreshAnnotations);
})();
