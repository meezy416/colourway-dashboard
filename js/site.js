/* ============================================================
   Colourway — scroll choreography
   Lenis (smooth scroll) + GSAP ScrollTrigger, mirroring the
   reference sites' motion system:
     · subscrr.app      — rise-blur reveals, glass nav, ease/spring curves
     · magic-receipt.ai — one long pinned sequence, velocity-reactive marquees
     · offten.xyz       — counter loader, locked stage before the reveal
   ============================================================ */

(function () {
  'use strict';

  /* If the animation libraries did not arrive — a CDN blip, a blocked request,
     an old browser — leave the page exactly as the HTML and CSS rendered it:
     complete, readable, static. Never a blank hero. */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'power3.out';

  gsap.registerPlugin(ScrollTrigger);

  /* from here on the page is motion-driven, so the hidden start states apply */
  document.documentElement.classList.add('js-motion');

  /* ── smooth scroll ─────────────────────────────────────── */
  var lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* anchor links go through Lenis so the easing is consistent */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── split headlines into words ────────────────────────── */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var outer = document.createElement('span');
      outer.className = 'word';
      var inner = document.createElement('span');
      inner.className = 'word__i';
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  function revealHeading(el, delay) {
    var items = el.querySelectorAll('.word__i');
    return gsap.fromTo(items,
      { yPercent: 108, opacity: 0, filter: 'blur(10px)' },
      {
        yPercent: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1.05, ease: EASE, stagger: 0.045, delay: delay || 0
      });
  }

  /* headings below the fold reveal on entry; the hero's is driven by the loader */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    if (el.closest('.hero')) return;
    gsap.set(el.querySelectorAll('.word__i'), { yPercent: 108, opacity: 0, filter: 'blur(10px)' });
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', once: true,
      onEnter: function () { revealHeading(el); }
    });
  });

  /* ── rise-blur reveals ─────────────────────────────────── */
  document.querySelectorAll('[data-rise]').forEach(function (el) {
    if (el.closest('.hero')) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: EASE });
      }
    });
  });

  /* ── nav tints once you leave the hero ─────────────────── */
  var nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: function (self) { nav.classList.toggle('is-stuck', self.scroll() > 60); }
  });

  /* ── marquees, reactive to scroll velocity ─────────────── */
  document.querySelectorAll('[data-marquee]').forEach(function (track) {
    var half = track.scrollWidth / 2;
    var x = 0, dir = -1, base = 0.55;
    var boost = 1;

    gsap.ticker.add(function () {
      x += base * boost * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
      boost += (1 - boost) * 0.06;
    });

    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = Math.abs(self.getVelocity());
        boost = Math.min(9, 1 + v / 380);
        dir = self.direction === 1 ? -1 : 1;
      }
    });
  });

  /* ── viewport-conditional choreography ─────────────────────
     Pinned sequences only make sense on a wide viewport with
     motion allowed. gsap.matchMedia re-evaluates on resize and
     reverts everything it created, so resizing the window does
     not strand the page in a half-built state.
     ───────────────────────────────────────────────────────── */
  var readPin  = document.querySelector('[data-read-pin]');
  var railPin  = document.querySelector('[data-rail-pin]');
  var railTrack = document.querySelector('[data-rail-track]');

  function showReadFinalState() {
    if (!readPin) return;
    gsap.set(readPin.querySelectorAll('.term__line, .fields li, [data-saved], [data-read-kicker], [data-receipt]'),
      { clearProps: 'all', opacity: 1 });
  }

  var mm = gsap.matchMedia();

  mm.add('(min-width: 681px) and (prefers-reduced-motion: no-preference)', function () {

    /* hero: device parallax */
    gsap.to('[data-device]', {
      yPercent: 13, rotate: -1.6, scale: 0.94, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hero__glow', {
      yPercent: 22, opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    /* ── the pinned extraction sequence ──────────────────── */
    if (readPin) {
      var lines  = readPin.querySelectorAll('.term__line');
      var fields = readPin.querySelectorAll('.fields li');

      gsap.set(fields, { opacity: 0, y: 14 });
      gsap.set(lines,  { opacity: 0, x: -10 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: readPin,
          start: 'top top',
          end: '+=4200',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var bar = readPin.querySelector('[data-read-bar]');
            if (bar) bar.style.width = (self.progress * 100).toFixed(1) + '%';
          }
        }
      });

      /* 1. the receipt arrives — a slow push-in */
      tl.fromTo('[data-receipt]',
        { scale: 0.86, yPercent: 16, opacity: 0, filter: 'blur(12px)' },
        { scale: 1, yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }, 0);
      tl.fromTo('[data-read-kicker]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3);

      /* 2. the scan sweep */
      tl.fromTo('.receipt__scan',
        { opacity: 0, yPercent: -110 },
        { opacity: 1, yPercent: 0, duration: 0.55, ease: 'none' }, 1.0)
        .to('.receipt__scan', { yPercent: 400, duration: 1.1, ease: 'none' }, 1.55)
        .to('.receipt__scan', { opacity: 0, duration: 0.3 }, 2.45);

      /* 3. status lines and fields interleave, the way the app reports as it goes */
      [
        { line: 0, at: 1.2 },
        { line: 1, at: 2.4, fields: [0, 1] },
        { line: 2, at: 3.2, fields: [2, 3, 4, 5] },
        { line: 3, at: 4.4, fields: [6, 7] },
        { line: 4, at: 5.6, fields: [8, 9] }
      ].forEach(function (step) {
        tl.to(lines[step.line], { opacity: 1, x: 0, duration: 0.35, ease: EASE }, step.at);
        if (!step.fields) return;
        step.fields.forEach(function (f, i) {
          tl.to(fields[f], { opacity: 1, y: 0, duration: 0.45, ease: EASE }, step.at + 0.15 + i * 0.22);
        });
      });

      /* the two unsure rows resolve into amber so they are not missed */
      tl.fromTo('.fields li.is-unsure b',
        { color: '#F2F1ED' },
        { color: '#E0A33C', duration: 0.5 }, 5.9);

      /* 4. the save, and the receipt recedes */
      tl.to('[data-saved]', { opacity: 1, y: 0, duration: 0.6, ease: EASE }, 6.6);
      tl.to('[data-receipt]', { scale: 0.93, opacity: 0.55, filter: 'blur(3px)', duration: 0.9, ease: 'power2.inOut' }, 6.8);
      tl.to({}, { duration: 0.8 }); /* hold on the finished state before releasing the pin */
    }

    /* ── horizontal screenshot rail ──────────────────────── */
    if (railPin && railTrack) {
      ScrollTrigger.create({
        trigger: railPin,
        start: 'top top',
        end: function () { return '+=' + (railTrack.scrollWidth - window.innerWidth + 200); },
        pin: true,
        scrub: 0.9,
        invalidateOnRefresh: true,
        animation: gsap.to(railTrack, {
          x: function () { return -(railTrack.scrollWidth - window.innerWidth + 120); },
          ease: 'none'
        })
      });
    }

    return function () { showReadFinalState(); };
  });

  /* narrow viewport, or motion turned down: no pins, finished state shown */
  mm.add('(max-width: 680px), (prefers-reduced-motion: reduce)', function () {
    showReadFinalState();
  });

  /* ── chapters: steps drive the sticky phone ────────────── */
  var steps = document.querySelectorAll('[data-steps] li');
  var shots = document.querySelectorAll('[data-shot]');
  steps.forEach(function (li, i) {
    ScrollTrigger.create({
      trigger: li,
      start: 'top 62%',
      end: 'bottom 46%',
      onToggle: function (self) {
        if (!self.isActive) return;
        steps.forEach(function (s) { s.classList.remove('is-on'); });
        shots.forEach(function (s) { s.classList.remove('is-on'); });
        li.classList.add('is-on');
        if (shots[i]) shots[i].classList.add('is-on');
      }
    });
  });
  if (steps[0]) steps[0].classList.add('is-on');

  /* ── loader ────────────────────────────────────────────── */
  var loader = document.getElementById('loader');

  function startHero() {
    var tl = gsap.timeline();
    var h1 = document.querySelector('.hero [data-split]');
    if (h1) {
      gsap.set(h1.querySelectorAll('.word__i'), { yPercent: 108, opacity: 0, filter: 'blur(10px)' });
      tl.add(revealHeading(h1), 0.05);
    }
    tl.to('.hero [data-rise]', {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 1, ease: EASE, stagger: 0.09
    }, 0.25);
    tl.fromTo('[data-device]',
      { opacity: 0, y: 60, scale: 0.94, filter: 'blur(14px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: EASE }, 0.1);
  }

  if (reduced || !loader) {
    if (loader) loader.remove();
    document.body.classList.remove('is-loading');
    gsap.set('.hero [data-rise]', { opacity: 1, y: 0, filter: 'none' });
  } else {
    document.body.classList.add('is-loading');
    var counter = { v: 0 };
    var out = document.getElementById('loaderCount');

    var opened = false;
    function openPage() {
      if (opened) return;
      opened = true;
      document.body.classList.remove('is-loading');
      loader.classList.add('is-done');
      if (loader.parentNode) loader.remove();
      startHero();          /* reveal first — it must not depend on what follows */
      ScrollTrigger.refresh();
    }

    /* Safety net. The loader is driven by requestAnimationFrame, which does not
       run in a background tab and can stall in odd environments. If it has not
       finished on its own, open the page anyway — a missed animation is nothing,
       a permanently blank hero is the whole homepage. */
    var failsafe = setTimeout(openPage, 5000);

    var lt = gsap.timeline({
      onComplete: function () { clearTimeout(failsafe); openPage(); }
    });

    lt.to('.loader__ring circle', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to('.loader__word span', { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.045 }, 0.25)
      .to(counter, {
        v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: function () { out.textContent = String(Math.round(counter.v)).padStart(3, '0'); }
      }, 0)
      .to('.loader__inner, .loader__count', { opacity: 0, duration: 0.45, ease: 'power2.in' }, 1.75)
      .to('.loader__curtain', { scaleY: 0, duration: 1.05, ease: 'expo.inOut', transformOrigin: 'top' }, 1.9);
  }

  /* keep pins honest when fonts land or the viewport changes */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
