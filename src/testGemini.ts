import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
});

const response = await llm.invoke(
  "What is LangChain? Explain in one sentence."
);

console.log(response.content);
