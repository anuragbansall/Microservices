import jwt from "jsonwebtoken";
import axios from "axios";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    console.log(
      "Fetching User Profile: ",
      `${process.env.BASE_URL}/users/profile`
    );

    const response = await axios.get(`${process.env.BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "User Profile Response: ",
      `${process.env.BASE_URL}/users/profile`,
      response.data
    );

    const { user } = response.data;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const captainAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const response = await axios.get(
      `${process.env.BASE_URL}/captains/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const captain = response.data;

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.captain = captain;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
