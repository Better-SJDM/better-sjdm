import * as L from "leaflet";
import boundaryUrl from "../data/san_jose_del_monte_barangays.geojson?url";
import stats from "../data/sjdm-statistics.json";

interface BarangayStat {
  psgcCode: string;
  name: string;
  adm4Name: string;
  district: number;
  hasBoundary: boolean;
  areaSqKm: number | null;
  population: Record<string, number | null>;
  note: string | null;
}

const barangayMap = new Map<string, BarangayStat>();
stats.barangays.forEach((b) => {
  barangayMap.set(b.psgcCode, b as BarangayStat);
});

const formatNumber = (num: number) => num.toLocaleString("en-PH");

const root = document.querySelector<HTMLElement>("[data-statistics]");
if (root) {
  const searchInput = root.querySelector<HTMLInputElement>("#barangay-search")!;
  const districtFilter =
    root.querySelector<HTMLDetailsElement>(".district-filter")!;
  const districtOptions = [
    ...districtFilter.querySelectorAll<HTMLInputElement>(
      "input[name=district]",
    ),
  ];
  const buttons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-bgy-btn]"),
  ];
  const listStatus = root.querySelector<HTMLElement>("[data-list-status]")!;
  const emptyState = root.querySelector<HTMLElement>("[data-list-empty]")!;
  const mapStatus = root.querySelector<HTMLElement>("[data-map-status]")!;
  const mapPrompt = root.querySelector<HTMLElement>("[data-map-prompt]")!;
  const detailPanel = root.querySelector<HTMLElement>("[data-bgy-detail]")!;

  // Detail panel elements
  const detailName =
    detailPanel?.querySelector<HTMLElement>("[data-detail-name]");
  const detailDistrict = detailPanel?.querySelector<HTMLElement>(
    "[data-detail-district]",
  );
  const detailPop = detailPanel?.querySelector<HTMLElement>(
    "[data-detail-population]",
  );
  const detailArea =
    detailPanel?.querySelector<HTMLElement>("[data-detail-area]");
  const detailPsgc =
    detailPanel?.querySelector<HTMLElement>("[data-detail-psgc]");
  const detailNote =
    detailPanel?.querySelector<HTMLElement>("[data-detail-note]");

  let activeDistrict = "all";
  const layers = new Map<string, L.Polygon>();
  let map: L.Map | undefined;
  let selectedCode: string | undefined;
  let hoveredCode: string | undefined;

  const normalStyle: L.PathOptions = {
    color: "#215b9b",
    weight: 1.5,
    fillColor: "#9cc7ee",
    fillOpacity: 0.35,
  };

  const hoverStyle: L.PathOptions = {
    color: "#003c9c",
    weight: 2.5,
    fillColor: "#62a5e8",
    fillOpacity: 0.6,
  };

  const selectedStyle: L.PathOptions = {
    color: "#002a6d",
    weight: 3.5,
    fillColor: "#ffcb24",
    fillOpacity: 0.75,
  };

  function updateDetail(code: string) {
    const data = barangayMap.get(code);
    if (!data) return;

    if (detailName) detailName.textContent = data.name;
    if (detailDistrict)
      detailDistrict.textContent = `District ${data.district}`;
    if (detailPop) {
      const pop2020 = data.population["2024"];
      detailPop.textContent =
        pop2020 != null ? formatNumber(pop2020) : "Not available";
    }
    if (detailArea) {
      detailArea.textContent =
        data.areaSqKm != null
          ? `${data.areaSqKm.toFixed(2)} km²`
          : "Not available";
    }
    if (detailPsgc) detailPsgc.textContent = data.psgcCode;
    if (detailNote) {
      if (data.note) {
        detailNote.textContent = data.note;
        detailNote.hidden = false;
      } else {
        detailNote.textContent = "";
        detailNote.hidden = true;
      }
    }
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    buttons.forEach((btn) => {
      const name = btn.dataset.name ?? "";
      const district = btn.dataset.district ?? "";
      const matchesQuery = !query || name.includes(query);
      const matchesDistrict =
        activeDistrict === "all" || district === activeDistrict;

      const isVisible = matchesQuery && matchesDistrict;
      btn.hidden = !isVisible;
      if (isVisible) visible++;
    });

    listStatus.textContent = `${visible} ${visible === 1 ? "barangay" : "barangays"} shown`;
    emptyState.hidden = visible > 0;
  }

  searchInput.addEventListener("input", applyFilters);

  districtFilter.addEventListener("change", (event) => {
    activeDistrict = (event.target as HTMLInputElement).value;
    districtFilter.dataset.filtered = String(activeDistrict !== "all");
    districtFilter.open = false;
    applyFilters();
  });
  document.addEventListener("click", (event) => {
    if (!districtFilter.contains(event.target as Node))
      districtFilter.open = false;
  });
  districtFilter.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && districtFilter.open) {
      districtFilter.open = false;
      districtFilter.querySelector<HTMLElement>("summary")?.focus();
    }
  });

  function selectBarangay(code: string, focusMap: boolean) {
    if (selectedCode && selectedCode !== code) {
      const prevLayer = layers.get(
        selectedCode.startsWith("030142006") ? "0301420007" : selectedCode,
      );
      if (prevLayer) prevLayer.setStyle(normalStyle);
      const prevBtn = buttons.find((b) => b.dataset.code === selectedCode);
      prevBtn?.removeAttribute("data-active");
    }

    selectedCode = code;
    const btn = buttons.find((b) => b.dataset.code === code);
    if (btn) {
      btn.setAttribute("data-active", "true");
      if (btn.hidden) {
        searchInput.value = "";
        activeDistrict = "all";
        districtOptions[0].checked = true;
        districtFilter.dataset.filtered = "false";
        applyFilters();
      }
      if (!focusMap) btn.scrollIntoView({ block: "nearest" });
    }

    updateDetail(code);

    const layer = layers.get(
      code.startsWith("030142006") ? "0301420007" : code,
    );
    if (layer && map) {
      layer.setStyle(selectedStyle);
      layer.bringToFront();
      if (focusMap) {
        map.fitBounds(layer.getBounds(), {
          padding: [30, 30],
          maxZoom: 15,
          animate: !window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches,
        });
      }
      const name = barangayMap.get(code)?.name;
      mapStatus.textContent = `Focused on Barangay ${name}.`;
    }
  }

  function highlightBarangay(code: string) {
    if (hoveredCode === code) return;
    hoveredCode = code;
    if (code !== selectedCode) {
      const layer = layers.get(code);
      if (layer) {
        layer.setStyle(hoverStyle);
        layer.bringToFront();
      }
    }
  }

  function unhighlightBarangay(code: string) {
    if (hoveredCode === code) hoveredCode = undefined;
    if (code !== selectedCode) {
      const layer = layers.get(code);
      if (layer) layer.setStyle(normalStyle);
    }
  }

  buttons.forEach((btn) => {
    const code = btn.dataset.code ?? "";
    btn.addEventListener("click", () => {
      selectBarangay(code, true);
    });
    btn.addEventListener("mouseenter", () => {
      highlightBarangay(code);
    });
    btn.addEventListener("mouseleave", () => {
      unhighlightBarangay(code);
    });
    btn.addEventListener("focus", () => {
      highlightBarangay(code);
    });
    btn.addEventListener("blur", () => {
      unhighlightBarangay(code);
    });
  });

  async function initMap() {
    try {
      const response = await fetch(boundaryUrl);
      if (!response.ok) throw new Error("Could not load boundary data");
      const data: GeoJSON.FeatureCollection = await response.json();

      map = L.map("barangay-map", {
        scrollWheelZoom: true,
        attributionControl: true,
        maxBoundsViscosity: 1,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map);

      const geoJsonLayer = L.geoJSON(data, {
        style: normalStyle,
        onEachFeature(feature, layer) {
          const code = String(feature.properties?.psgc_code ?? "");
          if (layer instanceof L.Polygon) {
            layers.set(code, layer);

            layer.on("click", () => {
              if (code === "0301420007") {
                mapStatus.textContent =
                  "Former Muzon boundary: select one of its four barangays from the list.";
              } else {
                selectBarangay(code, true);
              }
            });

            const bgy = barangayMap.get(code);
            if (bgy)
              layer.bindTooltip(
                code === "0301420007" ? "Former Muzon boundary" : bgy.name,
                { sticky: true },
              );

            layer.on("mouseover", () => {
              highlightBarangay(code);
              const bgy = barangayMap.get(code);
              if (bgy) {
                mapStatus.textContent =
                  code === "0301420007"
                    ? "Former Muzon boundary: select a barangay from the list."
                    : `Barangay ${bgy.name} · ${formatNumber(bgy.population["2024"] ?? 0)} residents (2024)`;
              }
            });

            layer.on("mouseout", () => {
              unhighlightBarangay(code);
              if (selectedCode) {
                const bgy = barangayMap.get(selectedCode);
                mapStatus.textContent = `Selected: Barangay ${bgy?.name}`;
              } else {
                mapStatus.textContent =
                  "Hover or click any barangay polygon or button.";
              }
            });
          }
        },
      }).addTo(map);

      const cityBounds = geoJsonLayer.getBounds();
      if (cityBounds.isValid()) {
        const updateZoomLimit = () => {
          if (!map) return;
          const size = map.getSize();
          const margin = Math.min(400, size.x / 4, size.y / 4);
          map.setMinZoom(
            map.getBoundsZoom(
              cityBounds,
              false,
              L.point(margin * 2, margin * 2),
            ),
          );
          const zoom = map.getMinZoom();
          const southwest = map
            .project(cityBounds.getSouthWest(), zoom)
            .add(L.point(-400, 400));
          const northeast = map
            .project(cityBounds.getNorthEast(), zoom)
            .add(L.point(400, -400));
          map.setMaxBounds(
            L.latLngBounds(
              map.unproject(southwest, zoom),
              map.unproject(northeast, zoom),
            ),
          );
        };
        updateZoomLimit();
        map.fitBounds(cityBounds, { padding: [20, 20] });
        map.on("resize", updateZoomLimit);
      }

      if (mapPrompt) mapPrompt.hidden = true;
      mapStatus.textContent = "Map loaded. Select any barangay to explore.";

      // Select default prominent barangay (Poblacion or Muzon)
      const defaultCode = "0301420008"; // Poblacion
      selectBarangay(defaultCode, false);
    } catch {
      if (mapPrompt) {
        mapPrompt.innerHTML = `<p class="map-error">Map could not be loaded. You can still explore all statistics in the cards below.</p>`;
        mapPrompt.hidden = false;
      }
      mapStatus.textContent =
        "Boundary data could not be displayed. Barangay directory remains available.";
    }
  }

  // Auto-load map when visible or directly
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void initMap();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    const mapContainer = root.querySelector("#barangay-map");
    if (mapContainer) observer.observe(mapContainer);
    else void initMap();
  } else {
    void initMap();
  }
}
