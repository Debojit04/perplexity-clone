import express from "express";
import "dotenv/config";
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    res.send("Perplexity Clone Backend is running!");
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
