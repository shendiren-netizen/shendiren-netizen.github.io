(() => {
  const canvas = document.querySelector('.flow-canvas');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const noise = window.SimplexNoise?.createNoise3D();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: 0, y: 0 };
  let width = 1, height = 1, mobile = false;
  let stars = [], meteors = [];
  let running = false, frame, previous = 0, lastFrame = 0, time = 0;
  let daytime;
  let meteorColors;
  let starColors;
  function syncPalette() {
    daytime = document.documentElement.dataset.theme === 'day';
    meteorColors = daytime ? ['42,103,183', '108,76,180', '31,125,143'] : ['184,226,255', '173,175,255', '255,226,167'];
    starColors = daytime ? ['#426cb0', '#7270b5', '#37818f', '#a27c36'] : ['#f1f5ff', '#b4d4ff', '#bdc0ff', '#ffe7bd'];
  }
  syncPalette();

  function newMeteor(initial = false, index = 0) {
    const angle = .52 + Math.random() * .18;
    const speed = (mobile ? 230 : 390) + Math.random() * (mobile ? 180 : 310);
    return {
      x: initial ? width * (.15 + Math.random() * .8) : width * (.55 + Math.random() * .55),
      y: initial ? height * (.05 + Math.random() * .85) : -20 - Math.random() * height * .1,
      vx: -Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      length: (mobile ? 105 : 185) + Math.random() * (mobile ? 105 : 185),
      width: .8 + Math.random() * .9,
      age: initial ? .35 + index * .12 : 0,
      life: 1.7 + Math.random() * 1.7,
      color: meteorColors[index % meteorColors.length],
      glow: .75 + Math.random() * .25,
    };
  }

  function drawStars() {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      const flicker = .72 + Math.sin(time * star.pulse + star.seed) * .21;
      const mist = noise ? noise(star.x / 600, star.y / 600, time * .035) * .1 : 0;
      const alpha = Math.max(.15, Math.min(1, star.alpha * flicker + mist));
      const x = (((star.x - time * star.depth * 1.4) % width + width) % width) + pointer.x * star.depth * 7;
      const y = ((star.y + time * star.depth * .65) % height) + pointer.y * star.depth * 5;
      context.globalAlpha = alpha;
      context.fillStyle = star.color;
      context.beginPath();
      context.arc(x, y, star.radius, 0, Math.PI * 2);
      context.fill();
      if (star.radius > 1.55) {
        context.strokeStyle = star.color;
        context.lineWidth = .55;
        context.globalAlpha = alpha * .5;
        context.beginPath();
        context.moveTo(x - 3.8, y); context.lineTo(x + 3.8, y);
        context.moveTo(x, y - 3.8); context.lineTo(x, y + 3.8);
        context.stroke();
      }
    }
    context.globalAlpha = 1;
  }

  function drawMeteors(delta) {
    if (!meteors.some(meteor => meteor.x > 0 && meteor.x < width && meteor.y > 0 && meteor.y < height)) {
      meteors[0] = newMeteor(true, 0);
    }
    meteors.forEach((meteor, index) => {
      meteor.age += delta;
      meteor.x += meteor.vx * delta;
      meteor.y += meteor.vy * delta;
      if (meteor.age >= meteor.life || meteor.x < -meteor.length || meteor.y > height + meteor.length) {
        meteors[index] = newMeteor(false, index);
        return;
      }
      const speed = Math.hypot(meteor.vx, meteor.vy);
      const tailX = meteor.x - meteor.vx / speed * meteor.length;
      const tailY = meteor.y - meteor.vy / speed * meteor.length;
      const fade = Math.min(1, meteor.age / .25, (meteor.life - meteor.age) / .4) * meteor.glow;
      const gradient = context.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
      gradient.addColorStop(0, `rgba(${meteor.color},0)`);
      gradient.addColorStop(.65, `rgba(${meteor.color},${fade * .25})`);
      gradient.addColorStop(1, `rgba(${meteor.color},${fade})`);
      context.strokeStyle = gradient;
      context.lineWidth = meteor.width;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(tailX, tailY); context.lineTo(meteor.x, meteor.y);
      context.stroke();
      const glow = context.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 5);
      glow.addColorStop(0, `rgba(${daytime ? meteor.color : '243,249,255'},${fade})`);
      glow.addColorStop(.3, `rgba(${meteor.color},${fade * .35})`);
      glow.addColorStop(1, `rgba(${meteor.color},0)`);
      context.fillStyle = glow;
      context.fillRect(meteor.x - 5, meteor.y - 5, 10, 10);
      context.fillStyle = `rgba(${daytime ? meteor.color : '245,250,255'},${fade})`;
      context.beginPath();
      context.arc(meteor.x, meteor.y, 1.1, 0, Math.PI * 2);
      context.fill();
    });
  }

  function render(delta = 0, moving = running) {
    if (moving) time += delta;
    drawStars();
    if (moving) drawMeteors(delta);
  }
  function resize() {
    width = innerWidth; height = innerHeight; mobile = width <= 760;
    const ratio = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = mobile ? Math.min(170, Math.round(width * height / 2000)) : Math.min(460, Math.max(240, Math.round(width * height / 2400)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: Math.random() < .08 ? 1.6 + Math.random() * .5 : .35 + Math.random() * 1.05,
      depth: .2 + Math.random() * .8, alpha: .4 + Math.random() * .6,
      pulse: .5 + Math.random() * 1.3, seed: Math.random() * 20,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));
    meteors = Array.from({ length: mobile ? 3 : 6 }, (_, index) => newMeteor(true, index));
    document.documentElement.dataset.sky = 'starfield';
    document.documentElement.dataset.meteors = String(meteors.length);
    render(0, running && !reduce.matches);
  }
  function tick(now) {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    const interval = 1000 / (mobile ? 30 : 60);
    if (now - lastFrame < interval) return;
    const delta = previous ? Math.min((now - previous) / 1000, .065) : .016;
    previous = now;
    lastFrame = now - ((now - lastFrame) % interval);
    render(delta, true);
  }
  function setActive(active) {
    document.documentElement.dataset.flow = active ? 'running' : 'paused';
    if (running === active) return;
    running = active;
    cancelAnimationFrame(frame);
    previous = 0;
    if (active) { render(0, true); frame = requestAnimationFrame(tick); }
    else render(0, false);
  }
  window.ambientFlow = Object.freeze({ setActive });
  document.addEventListener('diren-theme-change', () => { syncPalette(); resize(); });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !running) return;
    pointer.x = event.clientX / width - .5;
    pointer.y = event.clientY / height - .5;
  }, { passive: true });
  resize();
})();
