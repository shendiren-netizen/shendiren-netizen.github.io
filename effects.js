(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const toggle = document.querySelector('.motion-toggle');
  const toggleLabel = toggle.querySelector('.toggle-label');
  const burstButton = document.querySelector('.burst-button');
  const hint = document.querySelector('.playground-hint');
  const announcement = document.querySelector('.effect-announcement');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 760px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = document.querySelector('.celebration-canvas');
  let enabled = true;
  try { enabled = localStorage.getItem('diren.effects.v1') !== 'off'; } catch {}
  let particles;
  let particlePromise;
  let particleNarrow;
  let heroVisible = true;
  let lastBurst = 0;
  let burstTimer;
  let nameTween;
  const active = () => enabled && !reduce.matches;
  const confetti = window.confetti?.create(canvas, {
    resize: true, useWorker: true, disableForReducedMotion: true,
  });

  document.querySelector('.scene-controls').hidden = false;
  document.querySelector('.playground-bar').hidden = false;
  toggle.setAttribute('aria-label', '互动动效');

  async function initParticles() {
    if (particles || particlePromise || !active() || !window.tsParticles || !window.loadSlim) return particlePromise;
    root.dataset.particles = 'loading';
    particlePromise = (async () => {
      await loadSlim(tsParticles);
      particleNarrow = narrow.matches;
      particles = await tsParticles.load({
        id: 'hero-particles',
        options: {
          autoPlay: false,
          fullScreen: { enable: false },
          detectRetina: false,
          fpsLimit: particleNarrow ? 24 : 45,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          background: { color: { value: 'transparent' } },
          interactivity: {
            detectsOn: 'window',
            events: { onHover: { enable: finePointer.matches && !particleNarrow, mode: 'grab' }, onClick: { enable: false } },
            modes: { grab: { distance: 145, links: { opacity: .55, color: '#819f8e' } } },
          },
          particles: {
            number: { value: particleNarrow ? 18 : 48, density: { enable: false }, limit: { value: 60 } },
            paint: { color: { value: ['#e6bc37', '#7fa9b9', '#859a74'] }, fill: { enable: true, opacity: .85 }, stroke: { color: { value: '#677d61' }, opacity: .35, width: .4 } },
            shape: { type: ['circle', 'square', 'star'] },
            opacity: { value: { min: .3, max: .7 } },
            size: { value: { min: 2, max: 4.2 } },
            links: { enable: !particleNarrow, distance: 125, opacity: .28, width: .7, color: '#7d9d92' },
            move: { enable: true, speed: particleNarrow ? .35 : .55, direction: 'none', random: false, straight: false, outModes: { default: 'bounce' } },
            rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 3, sync: false } },
          },

        },
      });
      root.dataset.particles = particles ? 'ready' : 'unavailable';
      syncParticlePlayback();
    })().catch(error => {
      root.dataset.particles = 'unavailable';
      console.warn('Particle background could not initialize.', error);
    }).finally(() => { particlePromise = undefined; });
    return particlePromise;
  }

  function syncParticlePlayback() {
    if (!particles) return;
    if (active() && heroVisible && !document.hidden) particles.play();
    else particles.pause();
  }

  function restoreName() {
    nameTween?.kill();
    const name = document.querySelector('.name');
    name.textContent = 'diren shen';
    name.style.width = '';
  }

  function syncEffects() {
    root.dataset.effects = reduce.matches ? 'reduced' : enabled ? 'on' : 'off';
    toggle.disabled = reduce.matches;
    toggle.setAttribute('aria-pressed', String(active()));
    toggleLabel.textContent = reduce.matches ? '跟随系统' : enabled ? '动效开启' : '动效关闭';
    toggle.title = reduce.matches ? '系统已开启“减少动态效果”，本站会自动减弱动画' : '切换粒子与动画';
    burstButton.disabled = !active() || !confetti;
    hint.textContent = reduce.matches ? '已跟随系统减少动态效果，安心浏览' : !enabled ? '动效已暂停，随时可以重新开启' : narrow.matches ? '轻触「点燃灵感」，收获一点惊喜' : '移动鼠标探索粒子，或点击右侧按钮';
    if (window.gsap) {
      if (active()) {
        gsap.globalTimeline.resume();
        window.ScrollTrigger?.getAll().forEach(trigger => trigger.enable());
      } else {
        gsap.killTweensOf('.hero-copy > *, .hero-art, .reveal');
        gsap.set('.hero-copy > *, .hero-art, .reveal', { clearProps: 'transform,opacity' });
        gsap.set('.cursor-halo', { opacity: 0 });
        gsap.globalTimeline.pause();
        window.ScrollTrigger?.getAll().forEach(trigger => trigger.disable(false));
        restoreName();
      }
    }
    if (!active()) {
      confetti?.reset();
      clearTimeout(burstTimer);
      burstButton.classList.remove('is-bursting');
    } else initParticles();
    syncParticlePlayback();
    document.dispatchEvent(new CustomEvent('diren-effects-change', { detail: { enabled: active() } }));
  }

  toggle.addEventListener('click', () => {
    if (reduce.matches) return;
    enabled = !enabled;
    try { localStorage.setItem('diren.effects.v1', enabled ? 'on' : 'off'); } catch {}
    syncEffects();
  });
  reduce.addEventListener('change', syncEffects);
  narrow.addEventListener('change', async () => {
    await particlePromise;
    if (particles && particleNarrow !== narrow.matches) {
      particles.destroy();
      particles = undefined;
    }
    syncEffects();
  });
  const heroObserver = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncParticlePlayback();
  }, { threshold: .05 });
  heroObserver.observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) confetti?.reset();
    syncParticlePlayback();
  });

  burstButton.addEventListener('click', () => {
    if (!active() || !confetti || performance.now() - lastBurst < 1000) return;
    lastBurst = performance.now();
    const rect = burstButton.getBoundingClientRect();
    confetti({
      particleCount: narrow.matches ? 38 : 82,
      spread: 88, startVelocity: narrow.matches ? 27 : 37,
      ticks: 155, gravity: .9, decay: .93, scalar: .85,
      shapes: ['square', 'circle', 'star'],
      colors: ['#ffe363', '#addbed', '#cbe4bd', '#edcddd', '#232820'],
      origin: { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height / 2) / innerHeight },
    });
    burstButton.classList.add('is-bursting');
    announcement.textContent = '灵感已点燃！';
    clearTimeout(burstTimer);
    burstTimer = setTimeout(() => {
      burstButton.classList.remove('is-bursting');
      announcement.textContent = '';
    }, 1200);
    if (window.gsap) {
      gsap.fromTo('.playground-star', { rotation: -30, scale: .8 }, { rotation: 150, scale: 1, duration: .8, ease: 'back.out(2)', clearProps: 'transform' });
      gsap.fromTo('.identity-sticker', { rotation: -8, y: -12 }, { rotation: -3, y: 0, duration: .8, ease: 'elastic.out(1,.4)', overwrite: 'auto' });
    }
  });

  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.ScrambleTextPlugin) gsap.registerPlugin(ScrambleTextPlugin);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (window.ScrollTrigger) {
        gsap.to('.scene-orbit', {
          rotation: 38, y: -30, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
        gsap.to('.heading-doodle', {
          x: 18, rotation: -3, ease: 'none',
          scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.playground-star', { rotation: 90, duration: 14, repeat: -1, ease: 'none' });
      }
      function scrambleName() {
        if (!active() || !window.ScrambleTextPlugin || nameTween?.isActive()) return;
        const name = document.querySelector('.name');
        name.style.width = `${name.getBoundingClientRect().width}px`;
        nameTween = gsap.to(name, {
          duration: .85,
          scrambleText: { text: 'diren shen', chars: '01<>/_', revealDelay: .1, speed: .5 },
          onComplete: () => { name.style.width = ''; },
        });
      }
      const name = document.querySelector('.name');
      name.addEventListener('pointerenter', scrambleName);
      const ready = document.fonts ? document.fonts.ready : Promise.resolve();
      ready.then(() => { if (active()) scrambleName(); });
      return () => {
        name.removeEventListener('pointerenter', scrambleName);
        restoreName();
      };
    });

    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const halo = document.querySelector('.cursor-halo');
      gsap.set(halo, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(halo, 'x', { duration: .22, ease: 'power3.out' });
      const yTo = gsap.quickTo(halo, 'y', { duration: .22, ease: 'power3.out' });
      const opacityTo = gsap.quickTo(halo, 'opacity', { duration: .2 });
      function cursorMove(event) {
        if (!active() || event.pointerType === 'touch') return;
        xTo(event.clientX); yTo(event.clientY);
        opacityTo(.75);
      }
      function cursorLeave() {
        opacityTo(0);
      }
      document.addEventListener('pointermove', cursorMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', cursorLeave);
      const cleanups = [];
      document.querySelectorAll('[data-magnetic]').forEach(button => {
        const moveX = gsap.quickTo(button, 'x', { duration: .45, ease: 'power3.out' });
        const moveY = gsap.quickTo(button, 'y', { duration: .45, ease: 'power3.out' });
        function move(event) {
          if (!active()) return;
          const rect = button.getBoundingClientRect();
          moveX((event.clientX - rect.left - rect.width / 2) * .11);
          moveY((event.clientY - rect.top - rect.height / 2) * .15);
        }
        function reset() { moveX(0); moveY(0); }
        button.addEventListener('pointermove', move, { passive: true });
        button.addEventListener('pointerleave', reset);
        button.addEventListener('blur', reset);
        cleanups.push(() => {
          button.removeEventListener('pointermove', move);
          button.removeEventListener('pointerleave', reset);
          button.removeEventListener('blur', reset);
        });
      });
      return () => {
        document.removeEventListener('pointermove', cursorMove);
        document.documentElement.removeEventListener('pointerleave', cursorLeave);
        cleanups.forEach(cleanup => cleanup());
      };
    });
  }
  syncEffects();
})();
