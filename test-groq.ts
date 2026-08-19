import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function test() {
  try {
    console.log("Testing Groq...");

    const response =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "user",
            content: "Say hello in one sentence.",
          },
        ],
      });

    console.log("GROQ SUCCESS:");
    console.log(
      response.choices[0]?.message?.content
    );

  } catch (error) {
    console.error("GROQ ERROR:");
    console.error(error);
  }
}

test();
