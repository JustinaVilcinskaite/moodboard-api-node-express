import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const imageSchema = mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, index: true },
    boardId: { type: String, required: true },
    folderId: { type: String, required: true },
    // Phase 1: URL-based images
    url: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    note: { type: String, default: "", trim: true },
    tags: {
      type: [String],
      default: [],
      set: (value) => (Array.isArray(value) ? value : []),
    },

    // Future feature
    // colors: { type: [String], default: [] },
    // Later (upload): store provider key to delete/manage files
    // storageKey: { type: String },
  },
  { timestamps: true },
);

// TODO: After image reorder is implemented and stable,
// consider enforcing unique order values per folder at DB level.
// Example future index:
// imageSchema.index({ boardId: 1, folderId: 1, order: 1 }, { unique: true });

// For finding and sorting images inside a folder
imageSchema.index({ boardId: 1, folderId: 1, order: 1 });

export default mongoose.model("Image", imageSchema);
