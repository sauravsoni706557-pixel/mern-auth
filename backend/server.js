import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // cookies aane-jaane dene ke liye zaroori hai
  })
);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("MERN Auth API chal raha hai");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB se connect ho gaya");
    app.listen(PORT, () => console.log(`Server chal raha hai port ${PORT} par`));
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));
