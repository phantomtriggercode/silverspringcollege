# PDF.js (vendored)

`pdf.min.js`, `pdf.worker.min.js`, and `pdf_viewer.js` are Mozilla's
[PDF.js](https://mozilla.github.io/pdf.js/) library, version 3.11.174 (the
"legacy" UMD build, which works from a plain `<script>` tag with no
bundler).

- `pdf.min.js` / `pdf.worker.min.js` — the core library. Used by
  `results.html` to extract text from the GCE/TVEE results PDFs for the
  name/center-number search box.
- `pdf_viewer.js` (paired with `../../css/pdf_viewer.css`) — the
  `PDFViewer`/`PDFFindController` components. Used by `results-viewer.html`
  (the page embedded in the Results page's `<iframe>`) to render the PDF
  itself and to jump to and highlight a clicked search result — something
  the browser's native PDF plugin can't reliably do via a URL.

Sourced from the official `pdfjs-dist` npm package (`package/legacy/build/`
and `package/legacy/web/`). Licensed under Apache License 2.0 (see the
header comment in each file). To update: download a newer `pdfjs-dist`
release and replace all three files with its `legacy/build/pdf.min.js`,
`legacy/build/pdf.worker.min.js`, and `legacy/web/pdf_viewer.js` (plus
`legacy/web/pdf_viewer.css` into `../../css/`).
