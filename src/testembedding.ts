import { embeddings } from "./lib/embedding.js";

const text1 = "What is React?";
const text2 = "React is a JavaScript library for building user interfaces.";
const text3 = "What is the weather in Delhi today?";

const vector1 = await embeddings.embedQuery(text1);
const vector2 = await embeddings.embedQuery(text2);
const vector3 = await embeddings.embedQuery(text3);

console.log("Vector 1 length:", vector1.length);
console.log("Vector 2 length:", vector2.length);
console.log("Vector 3 length:", vector3.length);
