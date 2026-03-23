import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./src/routes/user.js";
import boardRouter from "./src/routes/board.js";
import folderRouter from "./src/routes/folder.js";
import imageRouter from "./src/routes/image.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB successfully!"))
  .catch((error) => {
    console.log(error);
  });

app.use("/api/users", userRouter);
app.use("/api/boards", boardRouter);
app.use("/api/folders", folderRouter);
app.use("/api/images", imageRouter);

app.use((req, res) => {
  return res
    .status(404)
    .send({ message: "Sorry, this endpoint does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
