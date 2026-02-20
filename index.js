import express from "express";
import "dotenv/config";
import mongoose from "mongoose";

import userRouter from "./src/routes/user.js";

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB successfully!"))
  .catch((err) => {
    console.log(err);
  });

app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
