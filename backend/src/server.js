import express from "express";
import path from "path";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// health route
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

// connect DB then start server
connectDB().then(() => {
  app.listen(ENV.PORT || 3000, () => {
    console.log("Server is running on port:", ENV.PORT || 3000);
  });
});