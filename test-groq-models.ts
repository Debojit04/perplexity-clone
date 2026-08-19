import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function test() {
  try {
    const models = await groq.models.list();

    console.log("AVAILABLE MODELS:");

    for (const model of models.data) {
      console.log(model.id);
    }
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

test();

