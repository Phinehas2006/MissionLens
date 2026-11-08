(() => {
  'use strict';

  const ROOT_SELECTOR = '#root';
  const STYLE_ID = 'ml-space-transition-styles';
  const OVERLAY_ID = 'ml-space-transition-overlay';
  const PARTICLE_LIMIT = 1500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;
  let lastPath = location.pathname;
  let observer = null;
  let routeTimer = 0;
  let safetyTimer = 0;
  let frame = 0;
  let activeState = null;

  const styleText = `
    #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483647;overflow:hidden;pointer-events:auto;background:radial-gradient(ellipse at 50% 46%,rgba(9,34,73,.98),rgba(2,7,20,.99) 70%);clip-path:inset(var(--ml-reveal,0%) 0 0 0);will-change:clip-path;}
    #${OVERLAY_ID} canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}
    #${OVERLAY_ID}::before{content:"";position:absolute;z-index:2;left:0;right:0;top:var(--ml-scan-y,0%);height:2px;background:#bcecff;box-shadow:0 0 8px 2px #63caff,0 0 24px 8px rgba(41,156,255,.78),0 0 80px 26px rgba(41,125,255,.32);opacity:var(--ml-scan-opacity,0);}
    #${OVERLAY_ID}::after{content:"";position:absolute;z-index:2;left:0;right:0;top:var(--ml-scan-y,0%);height:100px;transform:translateY(-100%);background:linear-gradient(0deg,rgba(67,177,255,.12),transparent);opacity:var(--ml-scan-opacity,0);pointer-events:none;}
    #${OVERLAY_ID} .ml-transition-hud{position:absolute;z-index:3;left:clamp(18px,4vw,54px);bottom:clamp(20px,5vh,48px);font:10px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.18em;color:rgba(194,226,255,.76);text-transform:uppercase;text-shadow:0 0 12px rgba(60,175,255,.8);}
    #${OVERLAY_ID} .ml-transition-hud b{display:block;color:#e7f8ff;font-weight:500;font-size:11px;letter-spacing:.23em;}
    @media(prefers-reduced-motion:reduce){#${OVERLAY_ID}{transition:none!important}}
  `;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = styleText;
    document.head.appendChild(style);
  }

  function colorFor(element) {
    const raw = getComputedStyle(element).color;
    const values = raw.match(/[\d.]+/g);
    if (!values || values.length < 3) return [100, 194, 255];
    return values.slice(0, 3).map(Number);
  }

  function collectLayout() {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return [];
    const elements = root.querySelectorAll('h1,h2,h3,img,button,.story-card,.hero,.exhibit-layout,.science-detail,.video-card,.about-page article');
    const points = [];
    const stride = Math.max(22, Math.ceil(Math.sqrt((innerWidth * innerHeight) / PARTICLE_LIMIT)));
    for (const element of elements) {
      if (points.length >= PARTICLE_LIMIT) break;
      const rect = element.getBoundingClientRect();
      if (rect.width < 5 || rect.height < 5 || rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) continue;
      const color = colorFor(element);
      const x0 = Math.max(0, rect.left), x1 = Math.min(innerWidth, rect.right);
      const y0 = Math.max(0, rect.top), y1 = Math.min(innerHeight, rect.bottom);
      const width = Math.max(1, x1 - x0), height = Math.max(1, y1 - y0);
      const cols = Math.max(1, Math.ceil(width / stride));
      const rows = Math.max(1, Math.ceil(height / stride));
      const stepX = width / cols, stepY = height / rows;
      for (let row = 0; row < rows && points.length < PARTICLE_LIMIT; row++) {
        for (let col = 0; col < cols && points.length < PARTICLE_LIMIT; col++) {
          const jitter = (Math.random() - .5) * Math.min(stepX, stepY) * .35;
          points.push({ x: x0 + (col + .5) * stepX + jitter, y: y0 + (row + .5) * stepY + jitter, color, size: 1 + Math.random() * 1.45, seed: Math.random() * Math.PI * 2, z: Math.random() * 700 - 350 });
        }
      }
    }
    return points;
  }

  function project(point, width, height, time, morph, phase) {
    const cx = width / 2, cy = height / 2;
    let x = point.x, y = point.y;
    if (phase === 'collapse') {
      const gather = Math.min(1, morph);
      const spiral = (1 - gather) * 54;
      x = point.x + (cx - point.x) * gather + Math.cos(time * .007 + point.seed) * spiral;
      y = point.y + (cy - point.y) * gather + Math.sin(time * .007 + point.seed) * spiral;
    } else if (phase === 'morph') {
      const t = morph * morph * (3 - 2 * morph);
      const tx = point.tx ?? cx, ty = point.ty ?? cy;
      const glitch = (1 - morph) * (Math.random() - .5) * 20;
      x = point.x + (tx - point.x) * t + glitch;
      y = point.y + (ty - point.y) * t + Math.sin(time * .012 + point.seed) * (1 - morph) * 8;
    }
    const perspective = 760 / (760 + point.z + Math.sin(time * .001 + point.seed) * 32);
    return { x: cx + (x - cx) * perspective, y: cy + (y - cy) * perspective, scale: perspective };
  }

  function drawMesh(ctx, particles, width, height, time, progress, phase) {
    ctx.clearRect(0, 0, width, height);
    const projected = particles.map(p => project(p, width, height, time, progress, phase));
    const cellSize = 62;
    const cells = new Map();
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const key = `${Math.floor(p.x / cellSize)},${Math.floor(p.y / cellSize)}`;
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(i);
    }
    ctx.lineWidth = .65;
    ctx.strokeStyle = 'rgba(83,187,255,.22)';
    ctx.beginPath();
    for (const indices of cells.values()) {
      for (let a = 0; a < indices.length; a++) {
        const p = projected[indices[a]];
        for (let b = a + 1; b < Math.min(indices.length, a + 7); b++) {
          const q = projected[indices[b]];
          const dx = p.x - q.x, dy = p.y - q.y;
          if (dx * dx + dy * dy < 2500) { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
        }
      }
    }
    ctx.stroke();
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i], source = particles[i];
      const pulse = .6 + .4 * Math.sin(time * .004 + source.seed);
      const alpha = Math.min(1, .35 + pulse * .6);
      const size = source.size * p.scale;
      const [r, g, b] = source.color;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.shadowColor = `rgba(77,190,255,${alpha})`;
      ctx.shadowBlur = phase === 'morph' ? 13 : 8;
      ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      if (phase === 'morph' && progress < .72 && i % 13 === 0) {
        const shift = (1 - progress) * 8;
        ctx.fillStyle = `rgba(255,69,120,${alpha * .28})`;
        ctx.fillRect(p.x - shift, p.y, size, size);
        ctx.fillStyle = `rgba(40,223,255,${alpha * .34})`;
        ctx.fillRect(p.x + shift, p.y, size, size);
      }
    }
    ctx.shadowBlur = 0;
  }

  function finish() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    clearTimeout(routeTimer);
    clearTimeout(safetyTimer);
    if (observer) observer.disconnect();
    observer = null;
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) overlay.remove();
    activeState = null;
    lastPath = location.pathname;
  }

  function beginTransition() {
    if (active) return;
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return;
    active = true;
    ensureStyles();
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<canvas></canvas><div class="ml-transition-hud"><b>MISSION LENS // PHASE SHIFT</b><span>Re-aligning the observation field</span></div>';
    document.body.appendChild(overlay);
    const canvas = overlay.querySelector('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let width = 0, height = 0;
    const resize = () => { width = innerWidth; height = innerHeight; canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const particles = collectLayout();
    const fromPath = lastPath;
    activeState = { overlay, ctx, canvas, particles, fromPath, phase: 'collapse', phaseStart: performance.now(), routeChanged: false, resize };
    observer = new MutationObserver(() => {
      if (!activeState || activeState.routeChanged || location.pathname === fromPath) return;
      activeState.routeChanged = true;
      activeState.phase = 'morph';
      activeState.phaseStart = performance.now();
      clearTimeout(routeTimer);
      routeTimer = window.setTimeout(() => {
        if (!activeState) return;
        const targets = collectLayout();
        if (!targets.length) return;
        const source = activeState.particles;
        for (let i = 0; i < source.length; i++) {
          const target = targets[Math.min(targets.length - 1, Math.floor(i * targets.length / Math.max(1, source.length)))];
          source[i].tx = target.x; source[i].ty = target.y; source[i].tz = target.z;
        }
        activeState.phaseStart = performance.now();
      }, 420);
    });
    observer.observe(root, { subtree: true, childList: true, characterData: true });
    window.addEventListener('resize', resize, { passive: true, once: true });
    safetyTimer = window.setTimeout(finish, 7500);
    if (reduceMotion.matches) {
      overlay.style.transition = 'clip-path 260ms ease-out';
      if (location.pathname !== fromPath) activeState.routeChanged = true;
      requestAnimationFrame(() => { if (location.pathname !== fromPath) { overlay.style.setProperty('--ml-reveal', '100%'); window.setTimeout(finish, 280); } });
      return;
    }

    const collapseDuration = 280;
    const morphDuration = 620;
    const scanDuration = 920;
    const loop = now => {
      if (!activeState) return;
      const state = activeState;
      const elapsed = now - state.phaseStart;
      if (state.phase === 'collapse') {
        drawMesh(ctx, state.particles, width, height, now, Math.min(1, elapsed / collapseDuration), 'collapse');
      } else if (state.phase === 'morph') {
        const p = Math.min(1, elapsed / morphDuration);
        drawMesh(ctx, state.particles, width, height, now, p, 'morph');
        if (p >= 1) { state.phase = 'scan'; state.phaseStart = now; }
      } else if (state.phase === 'scan') {
        const p = Math.min(1, elapsed / scanDuration);
        overlay.style.setProperty('--ml-reveal', `${p * 100}%`);
        overlay.style.setProperty('--ml-scan-y', `${p * 100}%`);
        overlay.style.setProperty('--ml-scan-opacity', `${p < .98 ? 1 : (1 - p) * 50}`);
        drawMesh(ctx, state.particles, width, height, now, 1 - p, 'morph');
        if (p >= 1) { finish(); return; }
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
  }

  function isInternalNavigation(anchor, event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('data-transition-none')) return false;
    const target = new URL(anchor.href, location.href);
    if (target.origin !== location.origin) return false;
    return target.pathname !== location.pathname || target.search !== location.search;
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const anchor = target.closest('a[href]');
    if (anchor && isInternalNavigation(anchor, event)) { beginTransition(); return; }
    if (target.closest('.story-card button[aria-label^="Read the story:"],.back-button,.close-reader,.reader-finish .text-link')) beginTransition();
  }, true);

  window.addEventListener('popstate', () => {
    beginTransition();
    window.setTimeout(() => { lastPath = location.pathname; }, 50);
  });
  window.addEventListener('pageshow', () => { lastPath = location.pathname; });
})();
