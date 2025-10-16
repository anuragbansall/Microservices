import express from "express";
import morgan from "morgan";
import ridesRouter from "./routes/ride.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/", ridesRouter);

export default app;
