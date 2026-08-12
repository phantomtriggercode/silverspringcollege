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
// The EN/FR buttons and the visible <select> both drive the same Google
// Translate Website Translator widget, loaded via a <script> tag at the
// bottom of the page. The widget itself is hidden by CSS except for its
// native <select>, which we restyle to blend with the site nav — that
// select doubles as the "translate to any language" control, since Google
// populates it with every language it supports.

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
}

function setSiteLanguage(lang) {
  if (lang === 'en') {
    // Google has no "translate back to original" option in its own
    // select once a translation is active, so we just clear the cookie
    // it reads on init and reload to get the untranslated page back.
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
    location.reload();
    return;
  }

  const combo = document.querySelector('#google_translate_element select.goog-te-combo');
  if (combo) {
    combo.value = lang;
    combo.dispatchEvent(new Event('change'));
    syncLangButtons();
  } else {
    // Widget hasn't finished loading yet — set the cookie Google reads
    // on init, then reload so the translation applies from the start.
    document.cookie = `googtrans=/en/${lang}; path=/`;
    location.reload();
  }
}

document.querySelectorAll('.lang-quick-btn').forEach((btn) => {
  btn.addEventListener('click', () => setSiteLanguage(btn.dataset.lang));
});

// Keep the EN/FR buttons in sync when someone picks a language directly
// from Google's own select (event delegation, since it's added to the
// page after this script runs).
document.addEventListener('change', (e) => {
  if (e.target.matches('#google_translate_element select.goog-te-combo')) {
    syncLangButtons();
  }
});