/* ================================================================
   SHIBIE R M - PORTFOLIO SCRIPTS
   Handles: mobile nav, scroll-spy, reveal on scroll, footer year
   ================================================================ */

'use strict';

// Add JS hook class for CSS reveal animations
document.documentElement.classList.add('js-loaded');

// Respect reduced-motion preference
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ── THEME TOGGLE ───────────────────────────────────────────────

const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function applyTheme(theme) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', selectedTheme);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(selectedTheme === 'dark'));
    themeToggle.setAttribute('aria-label', selectedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (themeIcon) {
    themeIcon.innerHTML = selectedTheme === 'dark'
      ? '<path d="M18.3 14.8A7.2 7.2 0 0 1 9.2 5.7a7.3 7.3 0 1 0 9.1 9.1Z" fill="currentColor"/>'
      : '<circle cx="12" cy="12" r="4.1" fill="currentColor"/><path d="M12 1.7v2.3M12 20v2.3M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M1.7 12h2.3M20 12h2.3M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  localStorage.setItem('portfolio-theme', selectedTheme);
}

const savedTheme = localStorage.getItem('portfolio-theme');
applyTheme(savedTheme || 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

// ── MOBILE NAVIGATION ──────────────────────────────────────────

const menuBtn  = document.querySelector('.menu-toggle');
const navList  = document.querySelector('#primary-nav');
const navLinks = navList ? navList.querySelectorAll('a') : [];

function setMenuOpen(open) {
  if (!menuBtn || !navList) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navList.classList.toggle('is-open', open);
}

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    setMenuOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
}

navLinks.forEach(link => link.addEventListener('click', () => setMenuOpen(false)));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') setMenuOpen(false);
});


// ── SCROLL-SPY NAVIGATION ──────────────────────────────────────
// Highlights the nav link for whichever section is in view.

const sections = document.querySelectorAll('section[id]');

if ('IntersectionObserver' in window && sections.length) {
  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-list a').forEach(a => a.classList.remove('is-active'));
      const active = document.querySelector(`.nav-list a[data-nav-section="${id}"]`);
      if (active) active.classList.add('is-active');
    });
  }, { rootMargin: '-10% 0px -60% 0px' });

  sections.forEach(s => spyObserver.observe(s));
}


// ── SCROLL REVEAL ──────────────────────────────────────────────
// Elements with .reveal fade-slide in when they enter the viewport.

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const targets = document.querySelectorAll(
    '.hero-copy, .hero-aside, .about-grid, .about-facts, ' +
    '.project-entry, .skill-row, .timeline-entry, ' +
    '.edu-block, .learning, .contact-grid'
  );

  targets.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}


// ── FOOTER YEAR ────────────────────────────────────────────────

const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
