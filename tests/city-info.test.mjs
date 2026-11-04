import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { setImmediate } from "node:timers";
import ts from "typescript";

const source = ts.transpile(
  readFileSync(new URL("../src/scripts/city-info.ts", import.meta.url), "utf8"),
);

test("city strip displays valid weather and uses the exchange fallback", async () => {
  const weather = { textContent: "", title: "" };
  const weatherTime = { textContent: "" };
  const exchange = { textContent: "", title: "" };
  const clock = { textContent: "", dateTime: "" };
  const elements = {
    "[data-weather]": weather,
    "[data-weather-time]": weatherTime,
    "[data-exchange]": exchange,
    "[data-local-time]": clock,
  };
  const fetch = async (url) => {
    if (url.includes("open-meteo"))
      return {
        ok: true,
        json: async () => ({
          current: { temperature_2m: 28.3, time: "2026-11-03T12:00" },
        }),
      };
    if (url.includes("jsdelivr")) throw new Error("offline");
    return {
      ok: true,
      json: async () => ({ date: "2026-11-03", usd: { php: 58.123 } }),
    };
  };
  vm.runInNewContext(source, {
    document: { querySelector: (selector) => elements[selector] },
    window: { setInterval() {} },
    fetch,
    AbortSignal: globalThis.AbortSignal,
    Intl,
    Date,
    Number,
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(weather.textContent, "28°C");
  assert.equal(weatherTime.textContent, "2026-11-03 12:00 PHT");
  assert.equal(exchange.textContent, "US$1 ≈ ₱58.12 (2026-11-03)");
  assert.match(clock.textContent, /PHT$/);
});
