/* ============================================================
   MORE THAN AN EDITOR — Aryan Vishwakarma
   Renders all work from data/projects.js and drives scroll motion.
   No dependencies.
   ============================================================ */

(function () {
  'use strict';

  const DATA = window.PORTFOLIO_DATA || { PROJECTS: [], EDITING_WORK: [], BEHIND_WORK: [], DOC_WORK: [] };
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

  /* ---------- SELECTED WORK ---------- */
  function renderWork() {
    const grid = $('[data-work-grid]');
    if (!grid) return;

    DATA.PROJECTS.forEach(function (p, i) {
      const card = el('article', 'card card--' + (p.size || 'standard'));

      const mediaWrap = el('div', 'card__media');
      const inner = el('div', 'card__frame');
      const m = buildMedia({
        src: p.src,
        poster: p.poster,
        label: p.category,
        ratio: p.ratio,
      });
      inner.appendChild(m.frame);
      mediaWrap.appendChild(inner);
      bindHoverPlay(mediaWrap, m.video);
      card.appendChild(mediaWrap);

      const body = el('div', 'card__body');
      const title = el('h3', 'card__title', p.title);
      body.appendChild(title);

      const meta = el('div', 'card__meta');
      meta.appendChild(el('span', null, p.role));
      meta.appendChild(el('span', null, p.year));
      body.appendChild(meta);
      card.appendChild(body);

      if (p.blurb) card.appendChild(el('p', 'card__blurb', p.blurb));

      // Stagger within the grid.
      const idx = i % 3;
      card.style.setProperty('--delay', idx * 90 + 'ms');
      card.setAttribute('data-reveal', '');
      grid.appendChild(card);
    });
  }

  /* ---------- FEATURED PROJECT ---------- */
  function renderFeatured() {
    const host = $('[data-featured]');
    if (!host) return;
    const p = DATA.PROJECTS.find((x) => x.featured);
    if (!p) return;

    host.classList.add('is-rendered');
    const inner = el('div', 'featured__inner');

    const kicker = el('span', 'label featured__kicker', '04 — FEATURED PROJECT');
    inner.appendChild(kicker);

    inner.appendChild(el('h2', 'featured__title', p.title));
    inner.appendChild(el('p', 'featured__sub', p.blurb));

    const mediaWrap = el('div', 'featured__media');
    const m = buildMedia({ src: p.src, poster: p.poster, label: p.title, ratio: p.ratio });
    mediaWrap.appendChild(m.frame);
    bindHoverPlay(mediaWrap, m.video);
    inner.appendChild(mediaWrap);

    if (p.credits && p.credits.length) {
      const dl = el('dl', 'featured__credits');
      p.credits.forEach(function (c) {
        const wrap = el('div', 'featured__credit');
        wrap.appendChild(el('dt', null, c[0]));
        wrap.appendChild(el('dd', null, c[1]));
        dl.appendChild(wrap);
      });
      inner.appendChild(dl);
    }

    if (p.description) inner.appendChild(el('p', 'featured__desc', p.description));

    // Selected production stills — first four entries of the Behind the Camera set.
    const stills = DATA.BEHIND_WORK.slice(0, 4);
    if (stills.length) {
      const row = el('div', 'featured__stills');
      stills.forEach(function (s) {
        const fig = el('figure', 'still');
        const frame = el('div', 'still__frame');
        const sm = buildMedia({ src: null, poster: s.poster, label: s.title, ratio: s.ratio });
        frame.appendChild(sm.frame);
        fig.appendChild(frame);
        const cap = el('figcaption', 'still__cap');
        cap.appendChild(el('span', null, s.title));
        cap.appendChild(el('span', null, s.year));
        fig.appendChild(cap);
        row.appendChild(fig);
      });
      inner.appendChild(row);
    }

    inner.setAttribute('data-reveal', '');
    host.appendChild(inner);
  }

  /* ---------- THE EDIT ---------- */
  function renderEdit() {
    const grid = $('[data-edit-grid]');
    const filters = $('[data-edit-filters]');
    if (!grid) return;

    const cats = ['ALL'];
    DATA.EDITING_WORK.forEach(function (w) {
      if (cats.indexOf(w.cat) === -1) cats.push(w.cat);
    });

    const cardsByCat = {};
    DATA.EDITING_WORK.forEach(function (w, i) {
      const card = el('article', 'vcard');
      card.dataset.cat = w.cat;

      const frame = el('div', 'vcard__frame');
      const m = buildMedia({ src: w.src, poster: w.poster, label: w.title, index: String(i + 1).padStart(2, '0') });
      frame.appendChild(m.frame);
      card.appendChild(frame);
      bindHoverPlay(card, m.video);

      const head = el('div', 'vcard__head');
      head.appendChild(el('h3', 'vcard__title', w.title));
      head.appendChild(el('span', 'vcard__cat', w.year));
      card.appendChild(head);

      card.style.setProperty('--delay', (i % 3) * 80 + 'ms');
      card.setAttribute('data-reveal', '');
      grid.appendChild(card);
      cardsByCat[w.cat] = true;
    });

    if (!filters) return;

    cats.forEach(function (c) {
      const b = el('button', 'filter', c);
      b.type = 'button';
      b.dataset.filter = c;
      if (c === 'ALL') b.classList.add('is-active');
      filters.appendChild(b);
    });

    filters.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      const want = btn.dataset.filter;

      $$('.filter', filters).forEach(function (f) {
        f.classList.toggle('is-active', f === btn);
        f.setAttribute('aria-pressed', String(f === btn));
      });

      $$('.vcard', grid).forEach(function (c) {
        c.classList.toggle('is-hidden', want !== 'ALL' && c.dataset.cat !== want);
      });
    });
  }

  /* ---------- BEHIND THE CAMERA ---------- */
  function renderBehind() {
    const grid = $('[data-behind-grid]');
    if (!grid) return;

    DATA.BEHIND_WORK.forEach(function (s, i) {
      const fig = el('figure', 'still');
      const frame = el('div', 'still__frame');
      const m = buildMedia({ src: null, poster: s.poster, label: s.title, ratio: s.ratio });
      frame.appendChild(m.frame);
      fig.appendChild(frame);

      const cap = el('figcaption', 'still__cap');
      cap.appendChild(el('span', null, s.title));
      cap.appendChild(el('span', null, s.year));
      fig.appendChild(cap);

      fig.setAttribute('data-reveal', '');
      fig.style.setProperty('--delay', (i % 3) * 80 + 'ms');
      grid.appendChild(fig);
    });
  }

  /* ---------- DOCUMENTARY ---------- */
  function renderDocs() {
    const grid = $('[data-docs-grid]');
    if (!grid) return;

    DATA.DOC_WORK.forEach(function (d, i) {
      const fig = el('figure', 'doccard');
      const frame = el('div', 'doccard__frame');
      const m = buildMedia({ src: null, poster: d.poster, label: d.title, ratio: d.ratio });
      frame.appendChild(m.frame);
      fig.appendChild(frame);

      fig.appendChild(el('figcaption', 'doccard__title', d.title));
      if (d.caption) fig.appendChild(el('p', 'doccard__cap', d.caption));

      fig.setAttribute('data-reveal', '');
      fig.style.setProperty('--delay', (i % 4) * 90 + 'ms');
      grid.appendChild(fig);
    });
  }

  /* ---------- SCRAMBLE ---------- */
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>-_';

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
    renderWork();
    renderFeatured();
    renderEdit();
    renderBehind();
    renderDocs();

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
