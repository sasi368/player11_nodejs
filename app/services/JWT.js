import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages";
import { sendValidationResponse } from "../utils/responseUtils";

// Function to generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET);
};

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: MESSAGES.ACCESS_DENIED });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded; // Store user data in request object
    next();
  } catch (error) {
    sendValidationResponse(res, MESSAGES.INVALID_TOKEN, []);
  }
};
