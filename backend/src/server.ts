import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { verifyToken } from "./middleware/auth";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // 👈 frontend URL
    credentials: true,
  })
);

app.use(express.json());

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("MongoDB Connected");
});

app.use("/auth", authRoutes);

// 🔒 Protected

app.get("/profile", verifyToken, (req: any, res) => {
  console.log("USER:", req.user); // 👈 add this

  res.json({
    user: req.user,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 2020");
});