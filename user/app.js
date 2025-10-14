import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);

export default app;
