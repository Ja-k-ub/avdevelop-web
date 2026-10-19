/* AV Develop — navigace, mobilní menu, scroll-reveal */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky navigace ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('nav--solid', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobilní menu ---------- */
  var burger = document.getElementById('navBurger');
  var overlay = document.getElementById('navOverlay');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
  }
  burger.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  overlay.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' || e.target === overlay) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  });

  /* ---------- Hero slider (rotující projekty) ---------- */
  var slider = document.getElementById('heroSlider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var tabs = Array.prototype.slice.call(slider.querySelectorAll('.slider__tab'));
    var current = 0;
    var DURATION = 6500; /* musí odpovídat --slide-dur v CSS */
    var timer = null;

    var restartBar = function () {
      var bar = tabs[current] && tabs[current].querySelector('.slider__bar');
      if (bar) { bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = ''; }
    };
    var goTo = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === current); });
      tabs.forEach(function (t, k) { t.classList.toggle('is-active', k === current); });
      restartBar();
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var play = function () {
      if (reducedMotion || slides.length < 2) return;
      stop();
      restartBar();
      timer = setInterval(function () { goTo(current + 1); }, DURATION);
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { goTo(i); play(); });
    });

    /* pauza jen při skrytí záložky prohlížeče */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else play();
    });

    /* přednačtení fotek všech slidů, ať je prolnutí plynulé */
    window.addEventListener('load', function () {
      slides.forEach(function (s) {
        var bg = s.querySelector('.hero__bg');
        if (!bg) return;
        var m = (bg.style.backgroundImage || '').match(/url\(['"]?([^'")]+)['"]?\)/);
        if (m) { var im = new Image(); im.src = m[1]; }
      });
    });

    play();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
