const languageButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-language]"),
];
const translated = [
  ...document.querySelectorAll<HTMLElement>("[data-filipino]"),
];
const notice = document.querySelector<HTMLElement>("[data-language-notice]");

for (const element of translated)
  element.dataset.english = element.textContent ?? "";

function setLanguage(language: "en" | "fil") {
  for (const element of translated) {
    element.textContent =
      language === "fil"
        ? (element.dataset.filipino ?? "")
        : (element.dataset.english ?? "");
    element.lang = language;
  }
  for (const button of languageButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  }
  if (notice) notice.hidden = language !== "fil";
  document.dispatchEvent(
    new CustomEvent("better-sjdm-language", { detail: language }),
  );
  try {
    localStorage.setItem("better-sjdm-language", language);
  } catch {
    // Language still works for the current page when storage is unavailable.
  }
}

let savedLanguage: string | null = null;
try {
  savedLanguage = localStorage.getItem("better-sjdm-language");
} catch {
  // Use English when storage is unavailable.
}
setLanguage(savedLanguage === "fil" ? "fil" : "en");
for (const button of languageButtons) {
  button.addEventListener("click", () =>
    setLanguage(button.dataset.language === "fil" ? "fil" : "en"),
  );
}
