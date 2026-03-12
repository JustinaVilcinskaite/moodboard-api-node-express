import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// TODO: prevent duplicate order values inside the same board

const folderSchema = mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    boardId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);
// Index for listing folders inside a board in saved order

folderSchema.index({ boardId: 1, order: 1 });

// Enforce only one default folder per board
folderSchema.index(
  { boardId: 1 },
  {
    unique: true,
    partialFilterExpression: { isDefault: true },
  },
);

export default mongoose.model("Folder", folderSchema);
