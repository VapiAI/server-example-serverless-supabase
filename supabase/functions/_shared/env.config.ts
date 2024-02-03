export const envConfig = {
  weather: {
    baseUrl: Deno.env.get("WEATHER_BASE_URL") ??
      `https://api.openweathermap.org/data/2.5`,
    apiKey: Deno.env.get("WEATHER_API_KEY") ?? ``,
  },
  openai: {
    apiKey: Deno.env.get("OPENAI_API_KEY") ?? ``,
  },
  vapi: {
    baseUrl: Deno.env.get("VAPI_BASE_URL") ?? "https://api.vapi.ai",
    apiKey: Deno.env.get("VAPI_API_KEY") ?? "",
  },
};
