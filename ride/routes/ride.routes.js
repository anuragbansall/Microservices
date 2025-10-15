import express from "express";
import { createRide, acceptRide } from "../controllers/ride.controller.js";
import { userAuth, captainAuth } from "../middleware/ride.middleware.js";

const ridesRouter = express.Router();

ridesRouter.post("/create-ride", userAuth, createRide);
ridesRouter.put("/accept-ride", captainAuth, acceptRide);

export default ridesRouter;
