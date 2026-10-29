for (const container of document.querySelectorAll<HTMLElement>(
  "[data-service-search]",
)) {
  const input = container.querySelector<HTMLInputElement>("input");
  const items = [
    ...container.querySelectorAll<HTMLElement>("[data-service-item]"),
  ];
  const empty = container.querySelector<HTMLElement>(".empty");
  const label = container.querySelector<HTMLElement>("[data-results-label]");
  if (!input || !empty || !label) continue;
  const defaultLabel = label.textContent?.trim() ?? "Services";
  if (input.id === "directory-search")
    input.value = new URLSearchParams(location.search).get("q") ?? "";
  const update = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    for (const item of items) {
      item.hidden = !item.dataset.search?.includes(query);
      if (!item.hidden) visible++;
    }
    empty.hidden = visible > 0;
    label.textContent = query
      ? `${visible} ${visible === 1 ? "service" : "services"} found`
      : defaultLabel;
  };
  input.addEventListener("input", update);
  update();
}
