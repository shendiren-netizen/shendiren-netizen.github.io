(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = ['top', 'about', 'interests'].map(id => document.getElementById(id));
  let queued = false;
  function updateNav() {
    let current = 'top';
    for (const section of sections) if (section.getBoundingClientRect().top < 180) current = section.id;
    navLinks.forEach(link => {
      const active = link.hash === '#' + current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateNav); }
  }, { passive: true });
  updateNav();
  if (!window.gsap || reducedMotion.matches) return;
  const context = gsap.context(() => {
    gsap.from('.hero-copy > *', { y: 18, opacity: 0, duration: .7, stagger: .09, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.from('.hero-art', { y: 24, opacity: 0, duration: .9, delay: .25, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.to('.code-sticker', { y: -7, rotation: -6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.terminal-sticker', { y: 7, rotation: 11, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.bolt-sticker', { y: -5, rotation: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.from(entry.target, { y: 22, opacity: 0, duration: .75, ease: 'power2.out', clearProps: 'transform,opacity' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { context.revert(); observer.disconnect(); gsap.globalTimeline.clear(); gsap.set('.reveal', { clearProps: 'all' }); }
  });
})();
