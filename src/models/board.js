import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// TODO: add indexes

const boardSchema = mongoose.Schema(
  {
    id: { type: String, default: () => uuidv4(), unique: true },
    ownerId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    defaultFolderId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Board", boardSchema);
