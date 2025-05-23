import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
   
   
   
    const token = req.cookies.token; // Get token from cookie
    

    if (!token) {
      return res.status(401).json({ success: false, message: "No Token Unauthorized access" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid token" });
      req.user = decoded; // Attach user info to request
      next();
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};