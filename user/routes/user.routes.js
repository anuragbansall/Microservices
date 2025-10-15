import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import {
  verifyToken,
  isTokenBlacklisted,
} from "../middleware/user.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/profile", verifyToken, isTokenBlacklisted, getUserProfile);

export default userRouter;
