import authModel from './../models/Auth.model.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from 'fs'; // to remove local file after upload

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const register = async (req, res) => {
    try {
        const { name, phone, address, email, password, role } = req.body;
        const newUser = new authModel({ name, phone, address, email, password, role: role || 0 });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({ email, password });

    // If user not found
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign({ _id: user._id }, "cadetahmed2008", {
      expiresIn: "7d",
    });

    // Admin login
    if (user.role === 1) {
      return res.status(200).json({
        message: "Admin Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    }

    // Normal user login
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const uploadReport = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Upload file to Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.file.path);

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Generate AI summary
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are a helpful medical assistant.
      Explain this medical report in simple English and Roman Urdu.
      File link: ${uploaded.secure_url}
      If it contains lab values, describe if they are normal or abnormal.
    `;

    const result = await model.generateContent(prompt);
    const aiSummary = result.response.text();

    // Find user and add report
    const user = await authModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.report.push({
      title: req.file.originalname,
      fileUrl: uploaded.secure_url,
      aiSummary,
    });

    await user.save();

    res.status(200).json({
      message: "Report uploaded and saved to user profile",
      report: user.report[user.report.length - 1],
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload report", error: error.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const user = await authModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ report: user.report || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to get reports", error: err.message });
  }
};
export {register, login , uploadReport, getUserReports};