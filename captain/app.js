import express from "express";
import cookieParser from "cookie-parser";
import captainRouter from "./routes/captain.routes.js";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/", captainRouter);

export default app;
