const weather = document.querySelector<HTMLElement>("[data-weather]");
const weatherTime = document.querySelector<HTMLElement>("[data-weather-time]");
const exchange = document.querySelector<HTMLElement>("[data-exchange]");
const clock = document.querySelector<HTMLTimeElement>("[data-local-time]");

function updateClock() {
  if (!clock) return;
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = `${new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(now)} PHT`;
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Data unavailable");
  return response.json();
}

async function updateWeather() {
  if (!weather) return;
  try {
    const result = (await getJson(
      "https://api.open-meteo.com/v1/forecast?latitude=14.8139&longitude=121.0453&current=temperature_2m&timezone=Asia%2FManila",
    )) as { current?: { temperature_2m?: unknown; time?: unknown } };
    if (
      typeof result.current?.temperature_2m !== "number" ||
      !Number.isFinite(result.current.temperature_2m) ||
      typeof result.current.time !== "string"
    )
      throw new Error("Invalid weather data");
    weather.textContent = `${Math.round(result.current.temperature_2m)}°C`;
    if (weatherTime)
      weatherTime.textContent = `${result.current.time.replace("T", " ")} PHT`;
    weather.title = `Open-Meteo model estimate, ${result.current.time.replace("T", " ")} Philippine time`;
  } catch {
    weather.textContent = "Weather unavailable";
    if (weatherTime) weatherTime.textContent = "";
  }
}

async function updateExchange() {
  if (!exchange) return;
  const urls = [
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json",
    "https://latest.currency-api.pages.dev/v1/currencies/usd.min.json",
  ];
  for (const url of urls) {
    try {
      const result = (await getJson(url)) as {
        date?: unknown;
        usd?: { php?: unknown };
      };
      if (
        typeof result.usd?.php !== "number" ||
        !Number.isFinite(result.usd.php) ||
        result.usd.php <= 0 ||
        typeof result.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(result.date)
      )
        throw new Error("Invalid rate");
      exchange.textContent = `US$1 ≈ ₱${result.usd.php.toFixed(2)} (${result.date})`;
      exchange.title =
        "Indicative daily exchange rate; actual rates may differ.";
      return;
    } catch {
      /* Try the provider's fallback endpoint. */
    }
  }
  exchange.textContent = "USD to PHP unavailable";
}

updateClock();
window.setInterval(updateClock, 60000);
void updateWeather();
void updateExchange();
window.setInterval(
  () => {
    void updateWeather();
    void updateExchange();
  },
  30 * 60 * 1000,
);
