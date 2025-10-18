import dotenv from "dotenv";
dotenv.config();

const key = process.env.GEMINI_API_KEY;

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1/models?key=" + key
);
const data = await res.json();
console.log("✅ Available models:");
data.models.forEach((m) => console.log(m.name));
