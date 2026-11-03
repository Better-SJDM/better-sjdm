# Repository Governance and Protection Ruleset

This document describes proposed branch protection for Better SJDM and the CI workflow in this repository. GitHub ruleset settings must be checked by a repository administrator; this document does not establish that they are active.

---

## 1. Governance Objectives

1. **Protect the Production Branch (`main`):**
   Use reviewed pull requests for changes to `main`.
2. **Require Code Owner Approval:**
   Require review from the designated owners in `.github/CODEOWNERS` when configuring branch protection.
3. **Automated Quality Gates:**
   Continuous integration (CI) must pass formatting, linting, Astro diagnostics, typechecking, unit tests, and build verification before any pull request can be merged.
4. **Prevent History Corruption and Secret Leaks:**
   Configure protections against force pushes and branch deletion, and enable available credential scanning.
5. **Linear History:**
   Maintains a clean git log without redundant merge commits.

---

## 2. Proposed GitHub Branch Protection

A repository administrator can configure a ruleset for `main` in GitHub Settings under **Rules**, then verify its enforcement status. No ruleset configuration file is included in this repository, and the active remote settings have not been verified here.

Recommended settings include pull requests with owner review, required CI checks, conversation resolution, and protection against deletion and force pushes. Confirm that each setting is available for the repository and that the required check names match the workflows before enabling it.

---

## 3. Continuous Integration Pipeline (`.github/workflows/ci.yml`)

The CI workflow triggers on:

- Every push to `main`
- Every pull request targeting `main`

### Pipeline Stages:

1. **Repository Checkout:** Clones the commit using `actions/checkout@v4`.
2. **Environment Setup:** Installs pnpm 12 via `pnpm/action-setup@v4` and Node.js 24 with pnpm caching via `actions/setup-node@v4`.
3. **Dependency Installation:** Runs `pnpm install --frozen-lockfile` to ensure reproducible dependency trees.
4. **Code Style Verification:** Runs `pnpm format:check` to enforce Prettier rules across all markdown, Astro, TS, and JSON files.
5. **Static Analysis & Linting:** Runs `pnpm lint` via ESLint 9 to detect code quality issues.
6. **Typechecking & Diagnostics:** Runs `pnpm typecheck` (`astro check`) for TypeScript and Astro component validation.
7. **Automated Unit Tests:** Runs `pnpm test`, verifying census consistency, PSGC codes, and geographic boundary polygons.
8. **Static Build:** Runs `pnpm build` to confirm all Astro routes render cleanly into static distribution assets.
