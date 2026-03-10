import express from "express";
import path from "path";
import cors from "cors";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/inngest.js";

const app = express();
const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

// health check
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

// start server
connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log("Server running on port:", ENV.PORT);
  });
});