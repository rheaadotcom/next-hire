import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { connectDB } from "../lib/db.js";

const app = express();
const __dirname = path.resolve();

//miidlewares
app.use(express.json())
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));

app.use("/api/inngest",serve({client:inngest,functions}));


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

connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log("Server is running on port:", ENV.PORT);
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});