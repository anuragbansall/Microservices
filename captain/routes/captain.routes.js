import express from "express";
import {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  getCaptainProfile,
  updateCaptainAvailability,
  waitForRideRequests,
} from "../controllers/captain.controller.js";
import {
  verifyToken,
  isTokenBlacklisted,
} from "../middleware/captain.middleware.js";

const captainRouter = express.Router();

captainRouter.post("/register", registerCaptain);
captainRouter.post("/login", loginCaptain);
captainRouter.post("/logout", logoutCaptain);
captainRouter.get(
  "/profile",
  verifyToken,
  isTokenBlacklisted,
  getCaptainProfile
);
captainRouter.patch(
  "/availability",
  verifyToken,
  isTokenBlacklisted,
  updateCaptainAvailability
);
captainRouter.get(
  "/wait-for-rides",
  verifyToken,
  isTokenBlacklisted,
  waitForRideRequests
);

export default captainRouter;
