# Service content

Add one YAML file per service in `src/content/services/`. Its filename becomes the page URL. Fields: `title`, `description`, `category`, `source` (URL), `verified` (YYYY-MM-DD), and optional `contact` and `location`. Use `sample: true` for fictional entries. Astro validates entries during checks and builds.

Use a reliable source for real information, verify it before adding the entry, and record the verification date. Remove fictional examples when the directory has real content. Recheck published entries regularly.

Optional fields `eligibility`, `fees`, and `processingTime` are text; `requirements`, `steps`, and `keywords` are lists of text. Add only information supported by the source. Keywords may include reviewed search terms in other languages; they do not translate the page.
