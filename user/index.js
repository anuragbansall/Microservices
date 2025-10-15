import http from "http";
import app from "./app.js";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
import { connect } from "./service/rabbitmq.service.js";

dotenv.config();

connect();
connectDB();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});
