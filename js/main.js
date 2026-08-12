// ============================================
// MOBILE MENU TOGGLE
// ============================================
// Wrapped so that if anything here throws on a particular device/browser,
// it can never take down the other features below (copyright year,
// language switcher) — each section here initializes independently.
(function initMobileMenu() {
  // This must match the nav breakpoint in style.css (@media max-width: 900px)
  const MOBILE_NAV_BREAKPOINT = 900;

  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navBackdrop = document.getElementById('nav-backdrop');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdown = document.querySelector('.dropdown');

  if (!menuToggle || !mainNav) return;

  function openMobileNav() {
    mainNav.classList.add('open');
    menuToggle.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    document.body.classList.add('nav-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
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

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileNav);
  }

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
  // (phones don't have a mouse to "hover" with). This link is href="#"
  // purely as a hover trigger on desktop — it should never actually
  // navigate and leave "#" in the address bar, on any screen size.
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) {
        dropdown.classList.toggle('mobile-open');
        if (dropdown.classList.contains('mobile-open')) {
          // Scrolling to reveal the newly-expanded submenu shouldn't be
          // left to chance (browser auto-scroll behavior here is
          // inconsistent) — do it explicitly so the submenu is always
          // reachable inside the scrollable nav panel.
          requestAnimationFrame(() => {
            dropdown.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          });
        }
      }
    });
  }
})();

// ============================================
// AUTO-UPDATE COPYRIGHT YEAR
// ============================================
(function initCopyrightYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// ============================================
// LANGUAGE SWITCHER (English / Français)
// ============================================
// No third-party service involved — every translatable element carries
// its French text right on it (data-fr), and switching languages just
// swaps innerHTML in place, instantly, with no reload and nothing that
// depends on a network call succeeding.
(function initLanguageSwitcher() {
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
    // returning null — catch that so it can't stop translation from
    // working for this page view.
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
})();
