# Better SJDM

Better SJDM is a community-maintained guide to services and information in San Jose del Monte, Bulacan. It aims to make useful local information easier to find and easier for residents to improve together.

**Project status: early foundation.** The service directory currently contains fictional examples, not verified city services. Better SJDM is an independent community project and is not an official city government website.

## What is available

- A homepage and searchable service directory, with a page for each service.
- Source links and verification dates on service pages.
- An About page explaining the project and how to contribute.
- Responsive layouts built with Astro, Tailwind CSS v4, and Starwind UI.

The site is statically generated. Service information is stored in YAML files and compiled into the site at build time. Search runs in the browser. There is no backend or online submission form.

## Run locally

Install Node.js 24 and pnpm 12.11.2; these match the project's CI and package-manager configuration. From the project folder:

```bash
pnpm install
pnpm dev
```

Open the **Local** URL printed in the terminal, usually `http://localhost:4321/`. Keep the terminal running while using the site. If port 4321 is occupied, Astro may choose another port and print that URL instead.

To access the site from another device on the same trusted network, run `pnpm dev --host 0.0.0.0` and open the **Network** URL printed by Astro. Firewall settings may affect access.

The project uses pnpm's build-script approvals in `pnpm-workspace.yaml` for `esbuild` and `sharp`. If installation reports an ignored build script, review it before using `pnpm approve-builds`; do not approve unknown packages automatically.

## Contribute information

You do not need to write code to help. Once the repository is available on GitHub, use the **Content suggestion** issue template to suggest a service, or the **Content correction** template to report outdated information. Include the affected page or service, what should change, and a reliable source link.

To propose a YAML change yourself:

1. Fork the repository on GitHub, clone your fork, and create a branch for your change.
2. Add or edit a `.yaml` file in `src/content/services/`. Use a short, descriptive, lowercase filename such as `example-service.yaml`.
3. Check the information against a reliable, preferably official, source. Record the source URL and the date you checked it. Never submit unverified emergency contacts or present examples as real information.
4. Run the checks below and preview your entry locally. Confirm that its directory listing, detail page, and source link work.
5. Open a pull request describing the change, the source you used, and anything maintainers should verify. Maintainers review the information and checks before merging.

The filename determines the service page ID and URL. For example, `example-service.yaml` creates `/services/example-service/`. Renaming an existing file changes its URL, so avoid renaming published entries without handling existing links.

### Service YAML format

Create one file per service. This example is **fictional** and must not be published as a real service:

```yaml
title: Sample health assistance
description: An example of how a local health service could be listed here.
category: Health & wellness
source: https://example.com/
verified: 2026-01-01
sample: true
```

| Field         | Required | Description                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------------- |
| `title`       | Yes      | Name shown in the directory and on the detail page.                                   |
| `description` | Yes      | Short, factual explanation of the service.                                            |
| `category`    | Yes      | Group used by the homepage and search. Reuse an existing category name when suitable. |
| `source`      | Yes      | Full URL to the source supporting the information.                                    |
| `verified`    | Yes      | Date the information was checked, written as `YYYY-MM-DD`.                            |
| `sample`      | No       | Set to `true` for fictional examples. Defaults to `false` when omitted.               |
| `contact`     | No       | Verified contact information as a string.                                             |
| `location`    | No       | Verified location information as a string.                                            |

For a real entry, replace every example value with verified information and omit `sample` or set it to `false`. Add `contact` or `location` only when supported by the source. Quote values when YAML syntax requires it, such as text containing a colon followed by a space. Do not put private personal information or secrets in content files.

Astro's content collection validates the YAML during checks and builds. The homepage categories are derived from the entries; service search matches titles, descriptions, and categories. The directory currently has a page-wide notice saying entries are examples, so maintainers must update that notice when introducing real entries.

For more detail, see [CONTRIBUTING.md](CONTRIBUTING.md) and the [content guide](docs/content-guide.md).

## Checks and build

Run these before opening a pull request:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm format` formats supported files; `pnpm check` is an alias for the Astro typecheck. The production build is written to `dist/`, and `pnpm preview` serves a built site locally. GitHub Actions runs formatting, lint, typecheck, and build on pull requests once the workflow exists on the PR's base branch. A passing build checks the content schema, but it does not verify that the information is factually correct.

## Project structure

```text
src/
  components/site/       Shared site UI and service search
  components/starwind/   Starwind components used by the site
  content/services/      YAML service entries
  layouts/               Shared page layout and navigation
  pages/                 Homepage, directory, service pages, and other routes
  scripts/               Browser-side search behavior
  styles/                Tailwind, Starwind, and shared theme values
  content.config.ts      Content collection loader and schema
public/                  Logo, favicon, and other static assets
docs/                    Content guidance and release roadmap
.github/                 Issue templates and pull-request CI
```

Shared colors, font, gradient, and content-width values are in `src/styles/global.css`. Starwind's primary color uses the same brand color. Add or modify Starwind components through the project's existing Starwind setup.

## Releases and hosting

The current version and [changelog](CHANGELOG.md) describe the foundation release. The [release roadmap](docs/releases.md) outlines future milestones. Version changes, Git tags, and GitHub releases are **not automated**; maintainers must review and create them. PR checks do not publish or deploy the site.

Hosting has not been configured. `pnpm build` produces static files in `dist/`; choose and configure a host before publishing. Review all real content and establish an update process before a public launch.
