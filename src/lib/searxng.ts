import "dotenv/config";

const BASE_URL = process.env.SEARXNG_API_URL;

export const searchSearxng = async (query: string, opts: Record<string, any> = {}) => {
  const params = new URLSearchParams({
    q: query,
    format: "json",
  });

  Object.entries(opts).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const url = `${BASE_URL}/search?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`SearXNG request failed with status ${res.status}`);
  }

  const data = await res.json();
  return data;
};
