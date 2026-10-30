# Contributing

Thank you for helping improve Better SJDM. You can suggest a service or report a correction through an issue; no coding is required. Include a reliable source, preferably an official one. Never submit private personal information or unverified emergency numbers. See the [content guide](docs/content-guide.md) for service entries.

## Propose a change

1. For a substantial change, open an issue first to discuss it. For a small correction, a pull request (PR) is welcome directly.
2. Fork the repository, create a branch from `main`, and keep the change focused. Use a lowercase branch name such as `feat/service-search`, `fix/broken-link`, `docs/setup`, `content/health-service`, `chore/dependencies`, or `test/search`. Separate words with hyphens.
3. Make your changes and run the relevant checks below. Include reliable sources for content changes and screenshots for visible interface changes.
4. Open a PR against `main`, complete the template, and link any related issue. Use a conventional PR title such as `fix: correct a service link` or `feat(search): filter services by category`.
5. Respond to review feedback and wait for the required checks and code owner review. Maintainers decide when to merge.

Use conventional commit subjects for your commits, for example `docs: clarify local setup` or `fix(search): handle empty queries`. Common types are `feat`, `fix`, `docs`, `content`, `chore`, `test`, `refactor`, `style`, `perf`, `build`, and `ci`. PR titles follow the same format and are checked automatically; individual commits are a contributor convention and are not automatically checked. If a PR is squash merged, its final commit message should follow the same format.

## Local checks

Install Node.js 24 and pnpm 12+, then run:

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

Explain any check you could not run in the PR. Automated checks cannot verify whether service information is accurate.
