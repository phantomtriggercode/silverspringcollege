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
