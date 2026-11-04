import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

test("language selection translates marked text and remembers the choice", () => {
  const source = ts.transpile(
    readFileSync(
      new URL("../src/scripts/language.ts", import.meta.url),
      "utf8",
    ),
  );
  const label = {
    textContent: "Search",
    dataset: { filipino: "Maghanap" },
    lang: "en",
  };
  const notice = { hidden: true };
  const store = new Map();
  const buttons = ["en", "fil"].map((language) => ({
    dataset: { language },
    setAttribute(name, value) {
      this[name] = value;
    },
    addEventListener(_name, listener) {
      this.click = listener;
    },
  }));
  vm.runInNewContext(source, {
    document: {
      querySelectorAll: (selector) =>
        selector === "[data-language]" ? buttons : [label],
      querySelector: () => notice,
      dispatchEvent: () => {},
    },
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, value),
    },
    CustomEvent: class {
      constructor(type, options) {
        this.type = type;
        this.detail = options.detail;
      }
    },
  });
  buttons[1].click();
  assert.equal(label.textContent, "Maghanap");
  assert.equal(label.lang, "fil");
  assert.equal(notice.hidden, false);
  assert.equal(store.get("better-sjdm-language"), "fil");
  buttons[0].click();
  assert.equal(label.textContent, "Search");
  assert.equal(notice.hidden, true);
});
