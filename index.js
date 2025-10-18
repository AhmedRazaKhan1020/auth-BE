import authRoutes from './routes/authRoute.js';
import reportRoutes from './routes/reportRoute.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
const app = express();
dotenv.config();

// Middleware
app.use(cors({origin:process.env.FE_URL}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/auth', authRoutes);
app.use('/report', reportRoutes);

// MongoDB connection
mongoose.connect("mongodb+srv://AhmedRazaKhan1020:cadetahmed2008@cluster0.w1yjbb2.mongodb.net/authentication")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.listen("5000" || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});