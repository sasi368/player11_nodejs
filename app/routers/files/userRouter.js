import express from "express";
import {
  addWalletBalance,
  getUsers,
  register,
  updateProfile,
} from "../../controllers/userController.js";
import { authenticateUser } from "../../services/JWT.js";

// Route definitions
const userRouter = express.Router();

//get
userRouter.get("/getUsers", authenticateUser, getUsers);
//post
userRouter.post("/register", register);
userRouter.post("/addWalletBalance", addWalletBalance);
//put
userRouter.put("/updateProfile", authenticateUser, updateProfile);

export { userRouter };
