import "dotenv/config";

const response = await fetch(
  "http://localhost:3000/api/search",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "best React tutorials for beginners",
      mode: "video",
    }),
  }
);

console.log("Status:", response.status);

const data = await response.json();

console.log(
  JSON.stringify(data, null, 2)
);
