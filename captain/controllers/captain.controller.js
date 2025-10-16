import Captain from "../models/captain.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.model.js";
import { subscribe, publish } from "../service/rabbitmq.service.js";

const pendingRequests = [];

export const registerCaptain = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const captainExists = await Captain.findOne({ email });
    if (captainExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCaptain = new Captain({ name, email, password: hashedPassword });
    await newCaptain.save();

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "JWT_SECRET environment variable is not set" });
    }

    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // save in cookie with secure options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({ captain: newCaptain, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const captain = await Captain.findOne({ email });
    if (!captain) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log("Captain found:", captain);

    const isPasswordValid = await bcrypt.compare(password, captain.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "JWT_SECRET environment variable is not set" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // save in cookie with secure options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ captain, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutCaptain = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Add token to blacklist
  const blacklistedToken = new BlacklistToken({ token });
  blacklistedToken.save();

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCaptainProfile = async (req, res) => {
  try {
    const captain = await Captain.findById(req.captain.id).select("-password");
    console.log("Req Captain:", req.captain.id);
    console.log("Fetched Captain:", captain);
    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }

    res.status(200).json({ captain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCaptainAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const captain = await Captain.findByIdAndUpdate(
      req.captain.id,
      { isAvailable },
      { new: true }
    ).select("-password");

    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }

    res.status(200).json({ captain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const waitForRideRequests = (req, res) => {
  // Wait for 30 seconds for a ride request else timeout
  req.setTimeout(30000, () => {
    return res.status(204).end();
  });

  pendingRequests.push(res);
};

// Subscribe to ride requests
subscribe("new_ride", async (message) => {
  const ride = JSON.parse(message);
  console.log("New ride request received:", ride);

  // Notify all pending captains
  pendingRequests.forEach((res) => {
    res.status(200).json({ ride });
  });

  pendingRequests.length = 0; // Clear the array
});
