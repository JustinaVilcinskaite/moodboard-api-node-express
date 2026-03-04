import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// TODO: add indexes
// TODO enforce 1 default folder per board at DB level

const folderSchema = mongoose.Schema(
  {
    id: { type: String, default: () => uuidv4(), unique: true },
    boardId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Folder", folderSchema);
