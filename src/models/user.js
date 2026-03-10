import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { capitalizeFirstLetter } from "../utils/string-modifier.js";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: {
      type: String,
      required: true,
      trim: true,
      set: capitalizeFirstLetter,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
