// ============================================
// MOBILE MENU TOGGLE
// ============================================

// This must match the nav breakpoint in style.css (@media max-width: 900px) —
// below it we're in the slide-out mobile nav, above it the desktop nav.
const MOBILE_NAV_BREAKPOINT = 900;

// Grab references to the hamburger button, the nav menu, and the backdrop
// behind it.
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
const navBackdrop = document.getElementById('nav-backdrop');

function openMobileNav() {
  mainNav.classList.add('open');
  menuToggle.classList.add('open');
  navBackdrop.classList.add('open');
  document.body.classList.add('nav-open');
  menuToggle.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  mainNav.classList.remove('open');
  menuToggle.classList.remove('open');
  navBackdrop.classList.remove('open');
  document.body.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

// Tapping the hamburger toggles the menu; the button itself morphs into
// an X (see style.css) so it's clear the same button closes it again.
menuToggle.addEventListener('click', () => {
  if (mainNav.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

// Tapping the dimmed backdrop, pressing Escape, or tapping any real nav
// link all close the menu too — a slide-out menu with only one way to
// close it feels stuck.
navBackdrop.addEventListener('click', closeMobileNav);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mainNav.classList.contains('open')) {
    closeMobileNav();
  }
});

mainNav.querySelectorAll('a:not(.dropdown-toggle)').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) {
      closeMobileNav();
    }
  });
});

// On mobile, the Portal dropdown needs to open on TAP instead of HOVER
// (phones don't have a mouse to "hover" with).
// We only want this tap behavior on small screens, so we check window width.
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdown = document.querySelector('.dropdown');

dropdownToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) {
    e.preventDefault(); // stop the "#" link from jumping the page
    dropdown.classList.toggle('mobile-open');
  }
});
// ============================================
// AUTO-UPDATE COPYRIGHT YEAR
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// LANGUAGE SWITCHER (English / Français)
// ============================================
// No third-party service involved — every translatable element carries
// its French text right on it (data-fr), and switching languages just
// swaps innerHTML in place, instantly, with no reload and nothing that
// depends on a network call succeeding.

const LANG_STORAGE_KEY = 'scb-lang';

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-fr]').forEach((el) => {
    if (el.dataset.en === undefined) {
      el.dataset.en = el.innerHTML;
    }
    el.innerHTML = lang === 'fr' ? el.dataset.fr : el.dataset.en;
  });

  document.querySelectorAll('[data-fr-placeholder]').forEach((el) => {
    if (el.dataset.enPlaceholder === undefined) {
      el.dataset.enPlaceholder = el.placeholder;
    }
    el.placeholder = lang === 'fr' ? el.dataset.frPlaceholder : el.dataset.enPlaceholder;
  });

  document.querySelectorAll('.lang-select').forEach((select) => {
    select.value = lang;
  });
}

function getStoredLanguage() {
  // Some mobile browsers (Safari private mode, in-app browsers like
  // Instagram/Facebook's) throw on localStorage access instead of just
  // returning null. If that throw isn't caught here, it aborts the rest
  // of this script — including the addEventListener call below — so the
  // switcher would render but silently do nothing when clicked.
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === 'fr' ? 'fr' : 'en';
  } catch (e) {
    return 'en';
  }
}

function storeLanguage(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
    // Storage blocked — translation still applies for this page view,
    // it just won't be remembered on the next page.
  }
}

applyLanguage(getStoredLanguage());

document.querySelectorAll('.lang-select').forEach((select) => {
  select.addEventListener('change', () => {
    storeLanguage(select.value);
    applyLanguage(select.value);
  });
});