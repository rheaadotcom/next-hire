import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is running" });
});

// Deployment setup
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// 🔥 CONNECT DB FIRST
connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log("Server is running on port:", ENV.PORT);
  });
});