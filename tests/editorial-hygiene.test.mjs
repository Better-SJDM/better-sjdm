import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

test("repository maintains zero em dashes across markdown and code files", () => {
  let trackedFiles = [];
  try {
    trackedFiles = execSync("git ls-files", { encoding: "utf-8" })
      .trim()
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  } catch {
    // If not in a git repo during isolated test runs, skip git listing
    return;
  }

  const checkExtensions = /\.(md|astro|ts|js|mjs|json|yaml|yml)$/;
  const ignorePatterns = [/pnpm-lock\.yaml$/, /\.min\./];

  const filesToCheck = trackedFiles.filter(
    (f) =>
      existsSync(f) &&
      checkExtensions.test(f) &&
      !ignorePatterns.some((pattern) => pattern.test(f)),
  );

  const violations = [];
  for (const file of filesToCheck) {
    const text = readFileSync(file, "utf-8");
    const count = (text.match(/\u2014/g) || []).length;
    if (count > 0) {
      violations.push({ file, count });
    }
  }

  assert.equal(
    violations.length,
    0,
    `Found em dashes in files: ${JSON.stringify(violations, null, 2)}`,
  );
});
