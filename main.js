/* ============================================================
   MORE THAN AN EDITOR
   Scroll motion: reveal, scramble, craft pills, clock, showreel.
   No dependencies.
   ============================================================ */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- HELPERS ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------- SCRAMBLE ---------- */
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\|<>-_';

  function scramble(node) {
    if (reduced) return;
    const original = node.dataset.value || node.textContent;
    node.dataset.value = original;
    let frame = 0;
    const total = 16;
    const chars = original.split('');

    function tick() {
      frame++;
      const settle = Math.floor((frame / total) * chars.length);
      const out = chars
        .map(function (c, i) {
          if (c === ' ') return ' ';
          if (i < settle) return c;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
      node.textContent = out;
      if (frame < total) requestAnimationFrame(tick);
      else node.textContent = original;
    }
    tick();
  }

  /* ---------- REVEAL OBSERVER ---------- */
  function initReveal() {
    const nodes = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduced) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  /* ---------- CRAFT LIST REVEAL ---------- */
  function initCraft() {
    const words = $$('[data-craft]');
    const items = $$('[data-craft-item]');
    items.forEach(function (li, i) {
      li.style.setProperty('--delay', (i % 4) * 90 + 'ms');
    });
    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.2 }
    );
    items.forEach((n) => io.observe(n));
  }

  /* ---------- CLOCK ---------- */
  function initClock() {
    const node = $('[data-clock]');
    if (!node) return;
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      node.textContent = 'Mumbai ' + hh + ':' + mm + ':' + ss;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- SHOWREEL: click to play ---------- */
  function initReel() {
    const reel = $('.reel');
    if (!reel) return;
    const src = reel.dataset.src;
    if (!src) return;

    let video = null;
    let started = false;

    function start() {
      if (started) return;
      started = true;
      video = el('video', 'media__video');
      video.muted = false;
      video.playsInline = true;
      video.controls = true;
      video.loop = true;
      video.preload = 'metadata';
      const s = el('source');
      s.src = src;
      s.type = 'video/mp4';
      video.appendChild(s);
      reel.insertBefore(video, reel.firstChild);
      reel.classList.add('is-playing');
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    }

    reel.addEventListener('click', start);
    reel.style.cursor = 'pointer';
  }

  /* ---------- BOOT ---------- */
  function boot() {
    initReveal();
    initCraft();
    initClock();
    initReel();

    // Hero title scrambles once, on load.
    $$('[data-scramble]').forEach(function (n) {
      scramble(n);
      n.setAttribute('data-reveal', '');
    });

    // Re-run reveal for any nodes added after first pass.
    requestAnimationFrame(initReveal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
