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
// CONTACT FORM SPAM GUARD
// ============================================
// No technique blocks 100% of bots, but this stops the overwhelming
// majority without adding friction for real visitors: a honeypot field
// (Formspree discards submissions where it's filled, server-side) plus a
// minimum fill time — real people take at least a few seconds to type a
// message; bots that script-fill and submit instantly don't.
(function initContactFormSpamGuard() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const MIN_FILL_TIME_MS = 3000;
  const loadedAt = Date.now();
  const messageEl = document.getElementById('contact-form-message');

  form.addEventListener('submit', (e) => {
    const honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      e.preventDefault();
      return;
    }

    if (Date.now() - loadedAt < MIN_FILL_TIME_MS) {
      e.preventDefault();
      if (messageEl) messageEl.hidden = false;
    }
  });
})();

// ============================================
// SCROLL-REVEAL ANIMATIONS (homepage)
// ============================================
// Elements tagged .reveal / .reveal-scale fade+slide in the first time
// they cross into the viewport. Respects reduced-motion by just leaving
// everything visible (the CSS media query already handles the styling
// side of that; this only controls the trigger).
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-scale');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => observer.observe(el));
})();

// ============================================
// STAT COUNT-UP (homepage stats strip)
// ============================================
(function initCountUp() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
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

    // Lets other modules (e.g. the admissions countdown) that render their
    // own bilingual text via JS — rather than static data-fr markup —
    // know a switch happened, so they can re-render in the new language.
    document.dispatchEvent(new CustomEvent('scb:langchange', { detail: { lang } }));
  }

  // Only EN/FR exist on this site, so browser detection just needs to
  // answer "does the visitor prefer French?" — anything else falls back
  // to English. Checks navigator.languages (the visitor's full ranked
  // preference list) before the single-value navigator.language, since
  // a visitor might have French listed above English or vice versa.
  function detectBrowserLanguage() {
    const candidates = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];

    const prefersFrench = candidates.some((lang) => (
      typeof lang === 'string' && lang.toLowerCase().startsWith('fr')
    ));

    return prefersFrench ? 'fr' : 'en';
  }

  function getStoredLanguage() {
    // Some mobile browsers (Safari private mode, in-app browsers like
    // Instagram/Facebook's) throw on localStorage access instead of just
    // returning null — catch that so it can't stop translation from
    // working for this page view.
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      // A manual choice (from the switcher) always wins on repeat visits
      // — only fall back to the browser's language on a first visit.
      if (stored === 'fr' || stored === 'en') {
        return stored;
      }
    } catch (e) {
      // Storage blocked — fall through to browser detection below.
    }

    return detectBrowserLanguage();
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

// ============================================
// ADMISSIONS TIMELINE (progress bar)
// ============================================
// Renders its own bilingual text (rather than static data-fr markup)
// because the status and days-remaining depend on today's date, not
// just the selected language — it recomputes on load and again
// whenever the language switch fires.
(function initAdmissionsTimeline() {
  const cards = document.querySelectorAll('[data-admissions-start]');
  if (!cards.length) return;

  const DAY_MS = 24 * 60 * 60 * 1000;

  const COPY = {
    en: {
      ongoing: 'Admissions Ongoing',
      upcoming: 'Admissions Opening Soon',
      closed: 'Admissions Closed',
      daysLeft: (n) => `${n} day${n === 1 ? '' : 's'} left to apply`,
      opensIn: (n) => (n <= 0 ? 'Opens today' : `Opens in ${n} day${n === 1 ? '' : 's'}`),
      closedNote: 'This admissions cycle has ended',
    },
    fr: {
      ongoing: 'Admissions en Cours',
      upcoming: 'Ouverture Prochaine',
      closed: 'Admissions Closes',
      daysLeft: (n) => `${n} jour${n === 1 ? '' : 's'} restant${n === 1 ? '' : 's'} pour postuler`,
      opensIn: (n) => (n <= 0 ? "Ouvre aujourd'hui" : `Ouvre dans ${n} jour${n === 1 ? '' : 's'}`),
      closedNote: "Cette période d'admission est terminée",
    },
  };

  function currentLang() {
    return document.documentElement.lang === 'fr' ? 'fr' : 'en';
  }

  function render(card, lang) {
    const start = new Date(`${card.dataset.admissionsStart}T00:00:00`);
    const end = new Date(`${card.dataset.admissionsEnd}T23:59:59`);
    const now = new Date();
    const copy = COPY[lang] || COPY.en;

    const statusEl = card.querySelector('[data-admissions-status]');
    const labelEl = statusEl.querySelector('.status-label');
    const daysEl = card.querySelector('[data-admissions-days]');
    const fillEl = card.querySelector('[data-admissions-fill]');

    let percent;
    let state;
    let daysText;

    if (now < start) {
      percent = 0;
      state = 'upcoming';
      daysText = copy.opensIn(Math.ceil((start - now) / DAY_MS));
    } else if (now > end) {
      percent = 100;
      state = 'closed';
      daysText = copy.closedNote;
    } else {
      percent = ((now - start) / (end - start)) * 100;
      state = 'ongoing';
      daysText = copy.daysLeft(Math.max(0, Math.ceil((end - now) / DAY_MS)));
    }

    statusEl.classList.remove('is-ongoing', 'is-upcoming', 'is-closed');
    statusEl.classList.add(`is-${state}`);
    labelEl.textContent = copy[state];
    daysEl.textContent = daysText;
    fillEl.style.width = `${Math.min(100, Math.max(0, Math.round(percent)))}%`;
  }

  function renderAll(lang) {
    cards.forEach((card) => render(card, lang));
  }

  renderAll(currentLang());
  document.addEventListener('scb:langchange', (e) => renderAll(e.detail.lang));
})();

// ============================================
// GCE RESULTS — HOMEPAGE PICKER MODAL
// ============================================
(function initGceResultsModal() {
  const trigger = document.getElementById('gce-announcement-btn');
  const overlay = document.getElementById('gce-modal-overlay');
  if (!trigger || !overlay) return;

  const closeBtn = document.getElementById('gce-modal-close');

  function openModal() {
    overlay.classList.add('open');
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  trigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Clicking the dark backdrop (not the card itself) closes it too.
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();

// ============================================
// GCE RESULTS PAGE (results.html)
// ============================================
// Since this is a static site with no server to check file existence,
// each level is verified client-side with a HEAD request before the
// iframe is shown — that way a not-yet-uploaded PDF shows a friendly
// placeholder instead of the browser's blank/broken viewer.
(function initResultsPage() {
  const tabs = document.querySelectorAll('.results-tab');
  const frame = document.getElementById('results-frame');
  const placeholder = document.getElementById('results-placeholder');
  const downloadLink = document.getElementById('results-download-link');
  const titleEl = document.getElementById('results-viewer-title');
  const searchInput = document.getElementById('results-search-input');
  const searchStatus = document.getElementById('results-search-status');
  const searchResults = document.getElementById('results-search-results');
  const mobilePrompt = document.getElementById('results-mobile-prompt');
  const mobilePromptText = document.getElementById('results-mobile-prompt-text');
  const openTabLink = document.getElementById('results-open-tab-link');
  if (!tabs.length || !frame) return;

  // Fits the page to the width of the viewer and hides the page-thumbnail
  // side panel Chrome's built-in PDF viewer otherwise opens by default —
  // these are the same URL fragment params Adobe Reader popularized, which
  // Chromium's viewer still honors.
  const PDF_VIEW_PARAMS = 'toolbar=1&navpanes=0&view=FitH';

  // A results PDF can be either a single school's short document or a full
  // regional/national bulletin covering hundreds of schools — we've seen
  // documents past 350 pages. Phones don't have the RAM/CPU to lay out and
  // render that inline (it just goes blank), even though desktops handle
  // it fine. Past this many pages, mobile gets a lightweight "open in a
  // new tab" prompt instead of the embedded viewer.
  const LARGE_DOC_PAGE_THRESHOLD = 25;
  // Matches the breakpoint already used for .results-iframe-wrap's mobile
  // sizing in style.css.
  const MOBILE_QUERY = '(max-width: 700px)';

  const COPY = {
    en: {
      ol: '2026 O Level Results',
      al: '2026 A Level Results',
      indexing: 'Preparing search…',
      noResults: 'No matches found.',
      searchUnavailable: 'Search isn’t available for this document.',
      resultCount: (n) => `${n} match${n === 1 ? '' : 'es'} found`,
      pageLabel: (n) => `Page ${n}`,
      mobilePrompt: (n) => `This document has ${n} pages and is too large to preview smoothly on a phone. Search for your name or center number above, or open the full document in a new tab.`,
    },
    fr: {
      ol: 'Résultats du Niveau O 2026',
      al: 'Résultats du Niveau A 2026',
      indexing: 'Préparation de la recherche…',
      noResults: 'Aucun résultat trouvé.',
      searchUnavailable: 'La recherche n’est pas disponible pour ce document.',
      resultCount: (n) => `${n} résultat${n === 1 ? '' : 's'} trouvé${n === 1 ? '' : 's'}`,
      pageLabel: (n) => `Page ${n}`,
      mobilePrompt: (n) => `Ce document comporte ${n} pages et est trop volumineux pour un aperçu fluide sur téléphone. Recherchez votre nom ou numéro de centre ci-dessus, ou ouvrez le document complet dans un nouvel onglet.`,
    },
  };

  let currentLevel = 'ol';
  let usingMobilePrompt = false;
  let mobilePromptPageCount = 0;
  // Set once per page load and appended as a query string to every
  // request for the PDF itself. Some hosts (Hostinger's LiteSpeed cache
  // among them) cache static files like PDFs at the server/edge level —
  // a visitor clearing their own browser cache never reaches that. A
  // fresh query string on each page load is a different cache key every
  // time, so a just-replaced file is never served stale to the next
  // visitor. (Kept constant for the lifetime of this page view, rather
  // than regenerated per tab switch, so the pdf.js document cache below
  // and the embedded viewer always agree on the same URL.)
  const currentCacheBust = Date.now();
  // Per-level cache of the pdf.js document handle and its extracted page
  // text, so switching tabs back and forth (or repeated searches) doesn't
  // re-parse the PDF every time. Scoped to this page load only (a fresh
  // page load gets a fresh cache-bust anyway).
  const pdfDocCache = { ol: null, al: null };
  const textCache = { ol: null, al: null };
  let pdfJsLoadPromise = null;

  function currentLang() {
    return document.documentElement.lang === 'fr' ? 'fr' : 'en';
  }

  function copy() {
    return COPY[currentLang()] || COPY.en;
  }

  function pdfPathFor(level) {
    return `results/${level}-2026.pdf`;
  }

  function bustedPathFor(level) {
    return `${pdfPathFor(level)}?t=${currentCacheBust}`;
  }

  function isMobileViewport() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function renderTitle() {
    if (titleEl) titleEl.textContent = copy()[currentLevel];
  }

  function resetSearchUI() {
    if (searchInput) {
      searchInput.value = '';
      searchInput.disabled = true;
    }
    if (searchStatus) searchStatus.hidden = true;
    if (searchResults) {
      searchResults.hidden = true;
      searchResults.innerHTML = '';
    }
  }

  // pdf.js is used both for the search box's text extraction and (on
  // mobile, for large documents) to check the page count before deciding
  // whether to embed the iframe at all. Loaded once and reused.
  function ensurePdfJsLoaded() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfJsLoadPromise) return pdfJsLoadPromise;

    pdfJsLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'js/vendor/pdfjs/pdf.min.js';
      script.onload = () => {
        if (!window.pdfjsLib) {
          reject(new Error('pdf.js failed to initialize'));
          return;
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdfjs/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error('pdf.js failed to load'));
      document.head.appendChild(script);
    });

    return pdfJsLoadPromise;
  }

  function loadPdfDocument(level, path) {
    if (pdfDocCache[level]) return pdfDocCache[level];
    pdfDocCache[level] = ensurePdfJsLoaded().then((pdfjsLib) => pdfjsLib.getDocument(path).promise);
    return pdfDocCache[level];
  }

  function extractText(level) {
    if (textCache[level]) return Promise.resolve(textCache[level]);

    return loadPdfDocument(level, bustedPathFor(level)).then((pdf) => {
      const pageNumbers = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      return Promise.all(pageNumbers.map((num) => (
        pdf.getPage(num).then((page) => (
          page.getTextContent().then((content) => ({
            pageNum: num,
            text: content.items.map((item) => item.str).join(' '),
          }))
        ))
      ))).then((pages) => {
        textCache[level] = pages;
        return pages;
      });
    });
  }

  function showEmbeddedViewer(path) {
    usingMobilePrompt = false;
    if (mobilePrompt) mobilePrompt.hidden = true;
    frame.src = `${path}#${PDF_VIEW_PARAMS}`;
    frame.hidden = false;
    if (placeholder) placeholder.hidden = true;
  }

  function showMobilePrompt(path, numPages) {
    usingMobilePrompt = true;
    mobilePromptPageCount = numPages;
    frame.hidden = true;
    frame.src = 'about:blank';
    if (placeholder) placeholder.hidden = true;
    if (mobilePromptText) mobilePromptText.textContent = copy().mobilePrompt(numPages);
    if (openTabLink) openTabLink.href = `${path}#${PDF_VIEW_PARAMS}`;
    if (mobilePrompt) mobilePrompt.hidden = false;
  }

  function loadLevel(level, { pushState = true } = {}) {
    currentLevel = level === 'al' ? 'al' : 'ol';

    tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.level === currentLevel);
    });

    renderTitle();
    resetSearchUI();

    const path = bustedPathFor(currentLevel);

    if (downloadLink) {
      downloadLink.href = path;
    }

    if (pushState && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('level', currentLevel);
      window.history.replaceState(null, '', url);
    }

    frame.hidden = true;
    frame.src = 'about:blank';
    usingMobilePrompt = false;
    if (mobilePrompt) mobilePrompt.hidden = true;
    if (placeholder) placeholder.hidden = false;
    if (downloadLink) downloadLink.classList.add('is-hidden');

    fetch(path, { method: 'HEAD', cache: 'no-store' })
      .then((res) => {
        // Only trust it if the level tab hasn't changed again while this
        // request was in flight (fast tab-switching would otherwise let
        // a stale response show the wrong PDF).
        if (currentLevel !== level || !res.ok) return;

        if (downloadLink) downloadLink.classList.remove('is-hidden');
        if (searchInput) searchInput.disabled = false;

        loadPdfDocument(level, path)
          .then((pdf) => {
            if (currentLevel !== level) return;
            if (pdf.numPages > LARGE_DOC_PAGE_THRESHOLD && isMobileViewport()) {
              showMobilePrompt(path, pdf.numPages);
            } else {
              showEmbeddedViewer(path);
            }
          })
          .catch(() => {
            // Couldn't determine the page count (pdf.js failed to parse
            // it, or the library failed to load) — fall back to the plain
            // embedded viewer rather than leaving the page stuck on the
            // placeholder. Worst case this is the same experience as
            // before pdf.js was involved at all.
            if (currentLevel === level) showEmbeddedViewer(path);
          });
      })
      .catch(() => {
        // Treat a network error the same as "not found yet" — the
        // placeholder is already showing, nothing more to do.
      });
  }

  function jumpToPage(pageNum) {
    const path = bustedPathFor(currentLevel);
    const url = `${path}#${PDF_VIEW_PARAMS}&page=${pageNum}`;
    if (usingMobilePrompt) {
      window.open(url, '_blank', 'noopener');
    } else {
      frame.src = url;
    }
  }

  function buildSnippet(text, query, pageNum) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);
    if (matchIndex === -1) return null;

    const contextRadius = 28;
    const start = Math.max(0, matchIndex - contextRadius);
    const end = Math.min(text.length, matchIndex + query.length + contextRadius);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < text.length ? '…' : '';
    const before = text.slice(start, matchIndex);
    const matchedText = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length, end);

    const item = document.createElement('li');
    const pageTag = document.createElement('span');
    pageTag.className = 'result-page-tag';
    pageTag.textContent = copy().pageLabel(pageNum);
    item.appendChild(pageTag);
    item.appendChild(document.createTextNode(`${prefix}${before}`));
    const strong = document.createElement('strong');
    strong.textContent = matchedText;
    item.appendChild(strong);
    item.appendChild(document.createTextNode(`${after}${suffix}`));
    return item;
  }

  function renderResults(matches, query) {
    if (!searchResults || !searchStatus) return;
    searchResults.innerHTML = '';

    if (!matches.length) {
      searchStatus.hidden = false;
      searchStatus.textContent = copy().noResults;
      searchResults.hidden = true;
      return;
    }

    searchStatus.hidden = false;
    searchStatus.textContent = copy().resultCount(matches.length);

    matches.forEach((match) => {
      const li = buildSnippet(match.text, query, match.pageNum);
      if (!li) return;
      li.classList.add('results-search-result');
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      const go = () => jumpToPage(match.pageNum);
      li.addEventListener('click', go);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
      searchResults.appendChild(li);
    });

    searchResults.hidden = false;
  }

  function runSearch(query) {
    if (!searchStatus || !searchResults) return;

    if (!query) {
      searchStatus.hidden = true;
      searchResults.hidden = true;
      searchResults.innerHTML = '';
      return;
    }

    searchStatus.hidden = false;
    searchStatus.textContent = copy().indexing;
    searchResults.hidden = true;

    const levelAtRequest = currentLevel;

    extractText(levelAtRequest)
      .then((pages) => {
        // The visitor may have switched tabs or cleared the box while the
        // PDF was being parsed — a stale result set would be confusing.
        if (currentLevel !== levelAtRequest || !searchInput || searchInput.value.trim() !== query) return;
        const matches = pages.filter((p) => p.text.toLowerCase().includes(query.toLowerCase()));
        renderResults(matches, query);
      })
      .catch(() => {
        if (currentLevel !== levelAtRequest) return;
        searchStatus.textContent = copy().searchUnavailable;
      });
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();
      debounceTimer = setTimeout(() => runSearch(query), 350);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => loadLevel(tab.dataset.level));
  });

  document.addEventListener('scb:langchange', () => {
    renderTitle();
    // Re-run so status/result text (which is JS-rendered, not data-fr)
    // updates too, if a search is currently active.
    if (searchInput && searchInput.value.trim()) runSearch(searchInput.value.trim());
    if (usingMobilePrompt && mobilePromptText) {
      mobilePromptText.textContent = copy().mobilePrompt(mobilePromptPageCount);
    }
  });

  const initialLevel = new URLSearchParams(window.location.search).get('level');
  loadLevel(initialLevel === 'al' ? 'al' : 'ol', { pushState: false });
})();
