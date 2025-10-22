import jwt from "jsonwebtoken";
import authModel from "../models/Auth.model.js";

// Auth middleware
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "cadetahmed2008");
    const user = await authModel.findById(decoded._id);
    if (!user) throw new Error("User not found");

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
export default requireAuth;