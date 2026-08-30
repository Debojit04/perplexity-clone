import "dotenv/config";

async function test() {
  console.log("Testing Suggestion Generator Route...\n");

  const response = await fetch(
    "http://localhost:3000/api/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "Generate suggestions",
        mode: "suggestions",
        chat_history: [
          {
            role: "user",
            content: "What is React?",
          },
          {
            role: "assistant",
            content:
              "React is a JavaScript library for building user interfaces.",
          },
        ],
      }),
    }
  );

  console.log(
    "Status:",
    response.status
  );

  const data = await response.json();

  console.log("\nSUGGESTIONS:\n");

  console.log(
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

test().catch((error) => {
  console.error(
    "\nSUGGESTION ROUTE ERROR:"
  );

  console.error(error);
});
