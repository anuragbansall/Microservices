import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/users", proxy("http://localhost:3001"));
app.use("/captains", proxy("http://localhost:3002"));
app.use("/rides", proxy("http://localhost:3003"));

export default app;
