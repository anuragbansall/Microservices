import Ride from "../models/ride.model.js";

export const createRide = async (req, res) => {
  const { user } = req;
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ message: "Pickup and destination are required" });
  }

  try {
    const newRide = new Ride({ user: user._id, pickup, destination });
    await newRide.save();

    res.status(201).json(newRide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const acceptRide = async (req, res) => {
  // TODO: Implement this
};
