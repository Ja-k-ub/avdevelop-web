/* AV Develop — lightbox galerie (klávesnice, swipe, preload) */
(function () {
  'use strict';

  var gallery = document.getElementById('gallery');
  if (!gallery) return;

  var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
  if (!links.length) return;

  var current = 0;
  var lastFocus = null;

  /* ---------- Vytvoření overlaye ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Fotogalerie');
  lb.innerHTML =
    '<span class="lightbox__counter" aria-live="polite"></span>' +
    '<img class="lightbox__img" alt="">' +
    '<button class="lightbox__btn lightbox__close" aria-label="Zavřít galerii">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<button class="lightbox__btn lightbox__prev" aria-label="Předchozí fotka">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>' +
    '</button>' +
    '<button class="lightbox__btn lightbox__next" aria-label="Další fotka">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>' +
    '</button>';
  document.body.appendChild(lb);

  var img = lb.querySelector('.lightbox__img');
  var counter = lb.querySelector('.lightbox__counter');
  var btnClose = lb.querySelector('.lightbox__close');
  var btnPrev = lb.querySelector('.lightbox__prev');
  var btnNext = lb.querySelector('.lightbox__next');

  function srcAt(i) { return links[i].getAttribute('href'); }
  function altAt(i) {
    var t = links[i].querySelector('img');
    return t ? t.getAttribute('alt') || '' : '';
  }

  function preload(i) {
    var idx = (i + links.length) % links.length;
    var im = new Image();
    im.src = srcAt(idx);
  }

  function show(i) {
    current = (i + links.length) % links.length;
    img.src = srcAt(current);
    img.alt = altAt(current);
    counter.textContent = (current + 1) + ' / ' + links.length;
    preload(current + 1);
    preload(current - 1);
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });

  /* ---------- Klávesnice ---------- */
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { show(current - 1); }
    else if (e.key === 'ArrowRight') { show(current + 1); }
    else if (e.key === 'Tab') {
      /* jednoduchý focus-trap mezi třemi tlačítky */
      var focusables = [btnClose, btnPrev, btnNext];
      var idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey
        ? focusables[(idx - 1 + focusables.length) % focusables.length]
        : focusables[(idx + 1) % focusables.length];
      next.focus();
    }
  });

  /* ---------- Swipe na dotykových zařízeních ---------- */
  var startX = null;
  lb.addEventListener('pointerdown', function (e) { startX = e.clientX; });
  lb.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) {
      if (dx > 0) show(current - 1);
      else show(current + 1);
    }
  });
})();
