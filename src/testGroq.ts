import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

const response = await llm.invoke("What is React? Explain in one sentence.");

console.log(response.content);
