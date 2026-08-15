import { searchSearxng } from "./lib/searxng.js";

const results = await searchSearxng("What is React?");

console.log(JSON.stringify(results, null, 2));
