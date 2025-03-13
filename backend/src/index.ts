// backend/src/index.ts
import express from "express";
import cors from "cors";
import Counter from "./Counter";

const app = express();
const port = 3001;

app.use(cors());

const counter = Counter.getInstance();

app.get("/api/counter", (req, res) => {
  counter.increment();
  res.json({ count: counter.getCount() });
});

app.get("/api/counter/decrement", (req, res) => {
  counter.decrement();
  res.json({ count: counter.getCount() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
