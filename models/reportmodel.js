
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  fileUrl: String,
  aiSummary: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
