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
// LANGUAGE SWITCHER (Google Translate powered)
// ============================================
// The EN/FR buttons and the "more languages" <select> both drive the same
// Google Translate Website Translator widget, loaded via a <script> tag
// at the bottom of the page. The widget itself stays completely hidden
// (CSS) — we never touch its own UI, only the googtrans cookie it reads
// on load to decide what to translate the page into.

// Google calls this once its script has loaded (see the script tag at the
// bottom of the page, which references this function by name).
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'en', autoDisplay: false },
    'google_translate_element'
  );
  syncLangButtons();
}
window.googleTranslateElementInit = googleTranslateElementInit;

function currentGoogTransLang() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return 'en';
  // Google stores this cookie as "/en/<target-lang>"
  return decodeURIComponent(match[1]).split('/')[2] || 'en';
}

function syncLangButtons() {
  const lang = currentGoogTransLang();
  document.querySelectorAll('.lang-quick-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.querySelectorAll('.lang-more-select').forEach((select) => {
    const hasOption = Array.from(select.options).some((opt) => opt.value === lang);
    select.value = hasOption ? lang : '';
  });
}

function setSiteLanguage(lang) {
  // Google's widget reads this cookie on load and translates the page
  // before it finishes rendering. Setting it and reloading is the
  // reliable way to trigger a translation — simulating a change on
  // Google's own <select> is fragile (a synthetic event only reaches
  // Google's listener if it bubbles, and plain `new Event('change')`
  // doesn't by default) and depends on the widget already being loaded.
  if (lang === 'en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
  } else {
    document.cookie = `googtrans=/en/${lang}; path=/`;
  }
  location.reload();
}

document.querySelectorAll('.lang-quick-btn').forEach((btn) => {
  btn.addEventListener('click', () => setSiteLanguage(btn.dataset.lang));
});

document.querySelectorAll('.lang-more-select').forEach((select) => {
  select.addEventListener('change', () => setSiteLanguage(select.value));
});

// Reflect the active language in the switcher as soon as the page loads,
// in case the googleTranslateElementInit callback (which also calls this)
// is slow to fire.
syncLangButtons();