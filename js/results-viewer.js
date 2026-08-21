// Powers results-viewer.html, the iframe embedded by the Results page
// (js/main.js) to display a GCE/TVEE results PDF. Built on pdf.js's own
// PDFViewer + PDFFindController components (not the browser's native PDF
// plugin) so that:
//   - a clicked search result can jump straight to the matching page AND
//     highlight the matched text, which native PDF plugins don't reliably
//     support via URL fragments;
//   - large multi-hundred-page documents render smoothly on any device,
//     since PDFViewer only renders pages near the current scroll position
//     instead of the whole document at once.
//
// Reads its target document from the URL query string, and where to land
// in it from the URL hash:
//   results-viewer.html?file=<pdf-url>&lang=en#page=<n>&search=<query>
//
// The page/search hash is read on every hashchange, not just on load.
// Setting iframe.src to a URL that only differs by its #hash from the
// iframe's current URL does NOT reload the page (the browser treats it as
// an in-page fragment navigation, same as clicking an anchor link) — so
// js/main.js reuses this same loaded document and just updates the hash
// when a visitor clicks a different search result. That also means each
// result click is instant instead of re-fetching and re-parsing the whole
// PDF from scratch.

(function () {
  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');
  const lang = params.get('lang') === 'fr' ? 'fr' : 'en';

  const ERROR_TEXT = {
    en: 'This document could not be loaded. Try downloading it instead.',
    fr: "Ce document n'a pas pu être chargé. Essayez de le télécharger à la place.",
  };

  const errorEl = document.getElementById('viewer-error');

  function showError() {
    if (errorEl) {
      errorEl.textContent = ERROR_TEXT[lang];
      errorEl.classList.add('is-visible');
    }
  }

  if (!file || !window.pdfjsLib || !window.pdfjsViewer) {
    showError();
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdfjs/pdf.worker.min.js';

  const eventBus = new pdfjsViewer.EventBus();
  const linkService = new pdfjsViewer.PDFLinkService({ eventBus });
  const findController = new pdfjsViewer.PDFFindController({ eventBus, linkService });
  const pdfViewer = new pdfjsViewer.PDFViewer({
    container: document.getElementById('viewerContainer'),
    eventBus,
    linkService,
    findController,
    textLayerMode: 2,
  });
  linkService.setViewer(pdfViewer);

  let documentReady = false;

  function applyLocation() {
    if (!documentReady) return;

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const page = parseInt(hashParams.get('page'), 10) || 1;
    const search = hashParams.get('search') || '';

    pdfViewer.currentPageNumber = page;

    if (search) {
      // Re-running "find" (rather than only doing this once per query) is
      // what moves the find controller's "current match" highlight to the
      // page we just jumped to — otherwise it stays wherever the previous
      // click landed, even though the (lighter-styled) highlightAll marks
      // on every other page are already correct from the first search.
      // Cheap to repeat: the document's text was already extracted for the
      // first search, so this just re-locates the nearest match to the
      // page we're already on.
      setTimeout(() => {
        eventBus.dispatch('find', {
          type: '',
          query: search,
          phraseSearch: true,
          caseSensitive: false,
          entireWord: false,
          highlightAll: true,
          findPrevious: false,
        });
      }, 300);
    }
  }

  eventBus.on('pagesinit', () => {
    pdfViewer.currentScaleValue = 'page-width';
    documentReady = true;
    applyLocation();
  });

  window.addEventListener('hashchange', applyLocation);

  pdfjsLib.getDocument(file).promise.then((pdf) => {
    pdfViewer.setDocument(pdf);
    linkService.setDocument(pdf);
  }).catch(showError);
})();
