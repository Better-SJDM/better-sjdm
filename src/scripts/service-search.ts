for (const container of document.querySelectorAll<HTMLElement>(
  "[data-service-search]",
)) {
  const nativeInput = container.querySelector<HTMLInputElement>("input");
  if (!nativeInput) continue;
  const input = document.createElement("wa-input") as HTMLElement & {
    value: string;
  };
  for (const { name, value } of nativeInput.attributes) {
    input.setAttribute(name, value);
  }
  container.querySelector(`label[for="${nativeInput.id}"]`)?.remove();
  input.setAttribute(
    "label",
    nativeInput.id === "home-search"
      ? "Search services"
      : "Search by name, description, or category",
  );
  input.setAttribute("with-clear", "");
  nativeInput.replaceWith(input);
  const items = [
    ...container.querySelectorAll<HTMLElement>("[data-service-item]"),
  ];
  const empty = container.querySelector<HTMLElement>(".empty");
  const label = container.querySelector<HTMLElement>("[data-results-label]");
  const results = container.querySelector<HTMLElement>("[data-search-results]");
  const categories = container.querySelector<HTMLElement>(".categories");
  if (!input || !empty || !label) continue;
  const defaultLabel = label.textContent?.trim() ?? "Services";

  const form = container.querySelector<HTMLFormElement>("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const q = input.value?.trim() ?? "";
      if (input.id === "home-search") {
        e.preventDefault();
        window.location.href = `/services/${q ? `?q=${encodeURIComponent(q)}` : ""}`;
      }
    });
  }

  const initialQuery =
    input.id === "directory-search"
      ? (new URLSearchParams(location.search).get("q") ?? "")
      : "";
  if (initialQuery) {
    input.value = initialQuery;
    input.setAttribute("value", initialQuery);
  }

  const update = () => {
    const query = (input.value ?? "").trim().toLowerCase();
    if (input.id === "home-search") {
      if (categories) categories.hidden = Boolean(query);
      label.hidden = !query;
      if (results) results.hidden = !query;
    }
    let visible = 0;
    for (const item of items) {
      item.hidden = !item.dataset.search?.includes(query);
      if (!item.hidden) visible++;
    }
    empty.hidden = visible > 0 || (input.id === "home-search" && !query);
    label.textContent = query
      ? `${visible} ${visible === 1 ? "service" : "services"} found`
      : defaultLabel;
  };

  input.addEventListener("input", update);
  input.addEventListener("wa-input", update);
  input.addEventListener("wa-clear", () => {
    input.value = "";
    input.setAttribute("value", "");
    update();
  });

  if ("customElements" in window) {
    void customElements.whenDefined("wa-input").then(() => {
      if (initialQuery) {
        input.value = initialQuery;
      }
      update();
    });
  }

  update();
}
