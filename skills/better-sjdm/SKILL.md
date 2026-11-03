---
name: better-sjdm
description: Research, write, build, or update Better SJDM civic information and website features. Apply project standards for verification, attribution, clear resident-facing content, accessible UI, and maintainable Astro implementation.
---

# Better SJDM

## Purpose and scope

Help residents find reliable, understandable information about San Jose del Monte and act on it. Better SJDM is an independent community project, not an official government site. Keep that distinction clear, label fictional examples, and never imply government endorsement.

Before editing, inspect the relevant pages, data, callers, tests, and existing conventions. Read `docs/content-guide.md` when working on service content. Keep the user's requested scope; preserve unrelated work. Use the project's Astro, plain CSS, and existing folder structure. Create a folder only when the current structure does not fit.

## Verify civic information

For new or changed public-facing factual claims:

1. Find a direct source for each claim. Prefer the responsible government agency's original publication, official document, or dataset. Link to the supporting page or document, not merely an organization's homepage. A shared citation is fine for related claims when it clearly supports all of them.
2. Cross-check against an independent reliable source where possible. Confirm the place, names, units, definitions, reference date, and coverage match. Two sites copying the same source do not constitute independent confirmation.
3. Record the source, its publication or data reference date, and the date checked. Use the existing content schema where applicable. Explain if a figure is historical or a newer figure covers a different subject.
4. Resolve discrepancies with authoritative evidence. If confirmation or current information is unavailable, explicitly mark the limitation, omit the unsupported detail, or report it for review. Never invent figures, contacts, dates, requirements, or claims.
5. Recheck time-sensitive details, especially fees, office hours, officials, eligibility, service requirements, and emergency numbers. Do not publish an unverified contact as current.

For data, maps, boundaries, tiles, photos, icons, and other assets, identify the original provider and verify reuse terms. Provide attribution in the form and location required by the license, including visible map attribution when required. Do not represent historical or approximate boundaries as current precise ones. Explain gaps in the interface where they affect interpretation.

Check new and changed internal routes and external links. Repair confirmed broken links only with a relevant, trustworthy replacement. A redirect, access restriction, bot block, or network failure is not by itself proof a page is broken; report links that could not be verified. Do not claim that unchecked links work.

## Build for residents

- Avoid decorative section labels or uppercase kickers that merely repeat the page type, such as “Service guide.” Start with a useful, descriptive heading or the content itself. Present verified procedures as clearly ordered steps.
- Write clear, concise copy in familiar language. Put the information needed to make a decision or complete a task first. Explain necessary terms; remove repetition, filler, excessive detail, and unsupported claims.
- Make navigation and controls understandable without instructions where practical. Offer useful search, clear labels, and helpful empty and error states when the feature needs them. Keep content readable on phones and larger screens.
- For UI changes, use the available `antislop` and `antislop-ui` skills. Check keyboard operation, visible focus, meaningful labels, contrast, screen-reader access, and reduced motion when relevant. Avoid hover-only access to essential information.
- Use Web Awesome components for UI creation, styled with plain CSS to match the site; retain accessible, functional fallbacks where needed.
- Use plain CSS and the project's existing components, styles, and data conventions. Reuse code when it removes meaningful duplication, but avoid premature abstractions, needless configuration, new dependencies, and unrelated refactors. Add only what the task requires.
- Keep pages fast: limit asset size and client-side code, and use existing dependencies where appropriate. Use other relevant skills when they improve the task, with focused scope to reduce unnecessary token use.

## Finish and report

Run checks appropriate to the change, including project scripts where applicable. For UI changes, verify the affected flows in a browser when practical, including relevant mobile, keyboard, loading, empty, and error states. For data changes, check values against their sources and test totals or relationships where meaningful.

Report what changed, what was verified, and any remaining source, attribution, link, or testing limitations. Do not claim a check was performed if it was not. Follow the repository's contribution and review process.
