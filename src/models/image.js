import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// TODO: add indexes

const imageSchema = mongoose.Schema(
  {
    id: { type: String, default: () => uuidv4(), unique: true },
    boardId: { type: String, required: true, index: true },
    folderId: { type: String, required: true, index: true },
    // Phase 1: URL-based images
    url: { type: String, required: true },
    order: { type: Number, required: true },
    note: { type: String, default: "" },
    tags: { type: [String], default: [] },

    // Future feature
    // colors: { type: [String], default: [] },
    // Later (upload): store provider key to delete/manage files
    // storageKey: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Image", imageSchema);
