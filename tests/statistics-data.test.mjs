import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const stats = JSON.parse(
  readFileSync(new URL("../src/data/sjdm-statistics.json", import.meta.url)),
);
const boundaries = JSON.parse(
  readFileSync(
    new URL(
      "../src/data/san_jose_del_monte_barangays.geojson",
      import.meta.url,
    ),
  ),
);

test("barangay records match unique valid boundary identifiers", () => {
  const codes = stats.barangays.map((item) => item.psgcCode);
  const features = boundaries.features.map((item) => item.properties.psgc_code);
  assert.equal(new Set(codes).size, codes.length);
  assert.equal(new Set(features).size, features.length);
  assert.deepEqual(
    stats.barangays
      .filter((item) => item.hasBoundary)
      .map((item) => item.psgcCode)
      .sort(),
    [...features].sort(),
  );
  for (const { geometry } of boundaries.features) {
    assert.equal(geometry.type, "Polygon");
    for (const ring of geometry.coordinates) {
      assert.ok(ring.length >= 4);
      assert.deepEqual(ring[0], ring.at(-1));
      assert.ok(
        ring.every(
          ([lng, lat]) =>
            Number.isFinite(lng) &&
            Number.isFinite(lat) &&
            Math.abs(lng) <= 180 &&
            Math.abs(lat) <= 90,
        ),
      );
    }
  }
});

test("2020 census includes unified Muzon matching city census total", () => {
  const muzon = stats.barangays.find((item) => item.name === "Muzon Proper");
  assert.ok(muzon, "Historical Muzon is retained for comparison");
  assert.equal(muzon.population["2020"], 127506);
  assert.equal(stats.barangays.length, 62);

  const sum = stats.barangays.reduce(
    (total, item) => total + (item.population["2020"] ?? 0),
    0,
  );
  assert.equal(
    sum,
    stats.city.censusFigures.find((item) => item.year === 2020).totalPopulation,
  );
});

test("2024 barangay populations match the official city total", () => {
  assert.ok(
    stats.barangays.every((item) => Number.isInteger(item.population["2024"])),
  );
  assert.equal(
    stats.barangays.reduce((total, item) => total + item.population["2024"], 0),
    685688,
  );
  assert.equal(
    stats.city.censusFigures.find((item) => item.year === 2024).totalPopulation,
    685688,
  );
});
