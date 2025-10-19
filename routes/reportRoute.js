import Report from "../models/reportmodel.js";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.file.path);
    

    // Use latest Gemini model (fixed here 👇)
 const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a helpful medical assistant.
      Explain this medical report asit is in simple English and Roman Urdu.
      File link: ${uploaded.secure_url}
      If it contains lab values, describe if they are normal or abnormal.
    `;

    // Generate AI explanation
    const result = await model.generateContent(prompt);
    const aiSummary = result.response.text();

    // Save to MongoDB
    const report = await Report.create({
      userId: req.user?._id || null,
      title: req.file.originalname,
      fileUrl: uploaded.secure_url,
      aiSummary,
      date: new Date(),
    });

    res.status(200).json({
      message: "Report uploaded and analyzed successfully",
      report,
    });
  } catch (error) {
    console.error("Gemini/Cloudinary error:", error);
    res.status(500).json({ message: "AI processing failed", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let query = {};

    // If user is logged in and you have req.user
    if (req.user?._id) {
      query.userId = req.user._id;
    }

    const reports = await Report.find(query).sort({ date: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
});

export default router;

