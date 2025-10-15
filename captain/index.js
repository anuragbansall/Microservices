import http from "http";
import app from "./app.js";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Captain service is running on port ${PORT}`);
});
