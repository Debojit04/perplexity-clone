import "dotenv/config";
import express from "express";
import searchRouter from "./routes/search.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Perplexity Clone API is running",
  });
});

app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});
