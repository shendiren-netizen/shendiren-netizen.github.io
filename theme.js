(() => {
  const root = document.documentElement;
  function syncTime() {
    const hour = new Date().getHours();
    const theme = hour >= 7 && hour < 19 ? 'day' : 'night';
    if (root.dataset.theme === theme) return;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'day' ? '#f8fafc' : '#070d1f');
    document.dispatchEvent(new CustomEvent('diren-theme-change', { detail: { theme } }));
  }
  // Runs before the stylesheet, so the first paint already matches local time.
  syncTime();
  setInterval(syncTime, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncTime(); });
  window.addEventListener('focus', syncTime);
})();
