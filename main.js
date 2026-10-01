/* ============================================================
   MORE THAN AN EDITOR — Aryan Vishwakarma
   Renders all work from data/projects.js and drives scroll motion.
   No dependencies.
   ============================================================ */

(function () {
  'use strict';

  const DATA = window.PORTFOLIO_DATA || { PROJECTS: [] };
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

  /**
   * Builds a film-frame block. If a video exists it plays muted on hover /
   * click; if not, we show a designed placeholder so the layout still reads
   * as intentional rather than broken.
   */
  function buildMedia(opts) {
    const { src, poster, label, index, ratio } = opts;
    const frame = el('div', 'media media--empty');
    if (ratio) frame.style.aspectRatio = ratio;
    frame.dataset.ratio = ratio || '';

    if (label) frame.appendChild(el('span', 'media__stamp', label));
    if (index) frame.appendChild(el('span', 'media__index', index));

    let video = null;
    let img = null;

    if (src) {
      video = el('video', 'media__video');
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = 'none';
      if (poster) video.poster = poster;
      video.setAttribute('aria-label', label || 'Video');
      const s = el('source');
      s.src = src;
      s.type = 'video/mp4';
      video.appendChild(s);
      frame.appendChild(video);
    } else if (poster) {
      img = el('img', 'media__img');
      img.src = poster;
      img.alt = label || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', function () {
        frame.classList.remove('media--empty');
        img.classList.add('is-loaded');
      });
      // Poster missing — drop the broken image and fall back to the film-frame
      // placeholder so the section still reads as intentional.
      img.addEventListener('error', function () {
        img.remove();
        if (!video) frame.appendChild(buildCue());
      });
      frame.appendChild(img);
    } else {
      frame.appendChild(buildCue());
    }

    return { frame, video, img };
  }

  function buildCue() {
    const cue = el('div', 'media__cue');
    cue.appendChild(el('span', null, 'FOOTAGE PENDING'));
    return cue;
  }

  /** Hover-to-play. Returns a cleanup-free no-op when there is no video. */
  function bindHoverPlay(node, video) {
    if (!video) return;
    const play = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      video.classList.add('is-playing');
    };
    const stop = () => {
      video.pause();
      video.classList.remove('is-playing');
    };
    node.addEventListener('mouseenter', play);
    node.addEventListener('mouseleave', stop);
    node.addEventListener('focusin', play);
    node.addEventListener('focusout', stop);
  }

  /* ---------- FEATURED PROJECT ---------- */
  function renderFeatured() {
    const host = $('[data-featured]');
    if (!host) return;
    const p = DATA.PROJECTS.find((x) => x.featured);
    if (!p) return;

    host.classList.add('is-rendered');
    const inner = el('div', 'featured__inner');

    const kicker = el('span', 'label featured__kicker', '03 — FEATURED PROJECT');
    inner.appendChild(kicker);

    inner.appendChild(el('h2', 'featured__title', p.title));
    inner.appendChild(el('p', 'featured__sub', p.blurb));

    const mediaWrap = el('div', 'featured__media');
    const m = buildMedia({ src: p.src, poster: p.poster, label: p.title, ratio: p.ratio });
    mediaWrap.appendChild(m.frame);
    bindHoverPlay(mediaWrap, m.video);
    inner.appendChild(mediaWrap);

    if (p.description) inner.appendChild(el('p', 'featured__desc', p.description));

    inner.setAttribute('data-reveal', '');
    host.appendChild(inner);
  }

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
    renderFeatured();

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
