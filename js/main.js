// ============================================
// MOBILE MENU TOGGLE
// ============================================

// Grab references to the hamburger button and the nav menu
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

// When the hamburger button is clicked, toggle the "open" class on the nav.
// The CSS we wrote earlier says: .main-nav.open { right: 0; }
// So adding/removing this class is what slides the menu in and out.
menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// On mobile, the Portal dropdown needs to open on TAP instead of HOVER
// (phones don't have a mouse to "hover" with).
// We only want this tap behavior on small screens, so we check window width.
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdown = document.querySelector('.dropdown');

dropdownToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= 860) {
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
  return localStorage.getItem(LANG_STORAGE_KEY) === 'fr' ? 'fr' : 'en';
}

applyLanguage(getStoredLanguage());

document.querySelectorAll('.lang-select').forEach((select) => {
  select.addEventListener('change', () => {
    localStorage.setItem(LANG_STORAGE_KEY, select.value);
    applyLanguage(select.value);
  });
});