# PDF.js (vendored)

`pdf.min.js` and `pdf.worker.min.js` are Mozilla's [PDF.js](https://mozilla.github.io/pdf.js/)
library, version 3.11.174 (the "legacy" UMD build, which works from a plain
`<script>` tag with no bundler). Used only by `results.html`, to extract text
from the GCE results PDFs for the name/center-number search box — the PDF
itself is still displayed via the browser's native viewer in an `<iframe>`,
not by PDF.js.

Sourced from the official `pdfjs-dist` npm package
(`package/legacy/build/`). Licensed under Apache License 2.0 (see the header
comment in `pdf.min.js`). To update: download a newer `pdfjs-dist` release
and replace both files with its `legacy/build/pdf.min.js` and
`legacy/build/pdf.worker.min.js`.
