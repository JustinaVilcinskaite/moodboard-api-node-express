import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./src/routes/user.js";
import boardRouter from "./src/routes/board.js";
import folderRouter from "./src/routes/folder.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB successfully!"))
  .catch((err) => {
    console.log(err);
  });

app.use(userRouter);
app.use(boardRouter);
app.use(folderRouter);

app.use((re, res) => {
  return res
    .status(404)
    .send({ messag: "Sorry, this endpoint does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
