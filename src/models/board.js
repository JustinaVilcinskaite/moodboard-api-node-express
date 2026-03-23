import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const boardSchema = mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    ownerId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    isPublic: { type: Boolean, default: false },
    defaultFolderId: { type: String, required: true },
  },
  { timestamps: true },
);
boardSchema.index({ ownerId: 1, createdAt: -1 });
boardSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.model("Board", boardSchema);
