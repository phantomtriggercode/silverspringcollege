# Uploads (staging)

Drop raw, unprocessed photos here via git push. This folder is **not**
referenced by any page — nothing here shows up on the live site
automatically.

Workflow:
1. Push photos into this folder (any filenames are fine).
2. Ask Claude to process them (e.g. remove a watermark, crop, resize).
3. Claude moves the finished version into `images/` (or wherever the
   site needs it) and wires it into the actual page.

Feel free to delete a file from here once it's been processed and moved.

## processed/

Finished versions of the photos in this folder — Gemini watermark
removed and upscaled 1.5x with mild sharpening, saved as web-friendly
JPEGs. The originals above are left untouched. These aren't wired into
any page yet; say the word and they can be placed (staff photos,
gallery, homepage hero, etc.).

Note on "upscale": there's no GPU available in this environment for true
AI super-resolution (Real-ESRGAN and similar failed to install), so this
is a high-quality Lanczos resize + light sharpening — it produces a
crisper, larger image but doesn't invent new detail the camera didn't
capture.
