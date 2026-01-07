import authRoutes from './routes/authRoute.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
const app = express();
dotenv.config();

// Middleware
app.use(cors({origin:process.env.FE_URL || "http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Routes
app.use('/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.listen("5000" || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});


