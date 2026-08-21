# GCE Results PDFs

Drop the official 2026 results PDFs into this folder with these
**exact filenames** and the Results page (`/results`) will pick them up
automatically — no code changes needed:

- `ol-2026.pdf` — GCE Ordinary Level results
- `al-2026.pdf` — GCE Advanced Level results
- `tvee-il-2026.pdf` — TVEE Intermediate Level (technical) results
- `tvee-al-2026.pdf` — TVEE Advanced Level (technical) results

Until a file is uploaded here, that level's tab on the Results page
shows a "not published yet" placeholder instead of a broken viewer.

## Workflow

1. Push the PDF into this folder via git (same as the `images/uploads/`
   folder), or upload it here through Hostinger's File Manager.
2. That's it — the page checks for the file at load time, so it goes
   live the moment the file exists at the right name. No redeploy of
   any code is required, though a normal Hostinger "Redeploy" is still
   needed the first time this feature ships.

## Next year

For the 2027 cycle (or any future year), either reuse these same four
filenames (simplest — just overwrite them), or ask Claude to wire up
new dated filenames (e.g. `ol-2027.pdf`) and update the page's title
and links to match.
