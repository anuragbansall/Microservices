import Ride from "../models/ride.model.js";
import { subscribe, publish } from "../service/rabbitmq.service.js";

export const createRide = async (req, res) => {
  const { user } = req;
  console.log("user in createRide:", user);
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ message: "Pickup and destination are required" });
  }

  try {
    const newRide = new Ride({ user: user._id, pickup, destination });
    await newRide.save();

    await publish("new_ride", JSON.stringify(newRide));

    res.status(201).json(newRide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const acceptRide = async (req, res) => {
  const { captain } = req;
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    console.log("Ride fetched for acceptance:", ride);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    console.log("Ride found:", ride);

    ride.status = "accepted";
    await ride.save();

    publish("ride_accepted", JSON.stringify(ride));

    res.status(200).json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
