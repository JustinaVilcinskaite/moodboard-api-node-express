import BoardModel from "../models/board.js";
import FolderModel from "../models/folder.js";
import ImageModel from "../models/image.js";

// Returns all images for the board.
// Frontend filters images by folderId for the Folders view.
// Overview will use the same images without folder filtering.
// TODO: Consider adding an optional ?folderId= query parameter
// for backend filtering if needed for folder-specific requests or pagination.
const GET_IMAGES_BY_BOARD = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const isOwner = board.ownerId === req.userId;

    if (!isOwner && !board.isPublic) {
      return res.status(404).json({ message: "Board not found" });
    }

    const images = await ImageModel.find({ boardId })
      .select(
        "id boardId folderId url order note tags createdAt updatedAt -_id",
      )
      .sort({
        folderId: 1,
        order: 1,
      });

    return res.status(200).json({ images });
  } catch (error) {
    console.error("GET_IMAGES_BY_BOARD error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Phase 1 - later do image upload
// Currently supports only URL-based images (no file storage yet)

const CREATE_IMAGE_BY_URL = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { url, folderId, note, tags } = req.body;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const targetFolderId = folderId ?? board.defaultFolderId;

    const folder = await FolderModel.findOne({ id: targetFolderId, boardId });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const lastImage = await ImageModel.findOne({
      boardId,
      folderId: targetFolderId,
    }).sort({ order: -1 });

    const newOrder = lastImage ? lastImage.order + 1 : 0;

    const image = new ImageModel({
      boardId,
      folderId: targetFolderId,
      url,
      order: newOrder,
      note,
      tags,
    });

    await image.save();

    return res
      .status(201)
      .json({ message: "Image created successfully", image });
  } catch (error) {
    console.error("CREATE_IMAGE_BY_URL error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const GET_IMAGE_BY_ID = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await ImageModel.findOne({ id: imageId }).select(
      "id boardId folderId url order note tags createdAt updatedAt -_id",
    );

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const board = await BoardModel.findOne({
      id: image.boardId,
    });

    if (!board) {
      return res.status(404).json({ message: "Image not found" });
    }

    const isOwner = board.ownerId === req.userId;

    if (!isOwner && !board.isPublic) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({ image });
  } catch (error) {
    console.error("GET_IMAGE_BY_ID error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Phase 1 - later do image reorder
// Currently only supports updating simple fields (note, tags..)
// Reordering (changing "order" or moving between folders) will be handled separately

const UPDATE_IMAGE_BY_ID = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await ImageModel.findOne({ id: imageId });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const board = await BoardModel.findOne({
      id: image.boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Image not found" });
    }

    const updatedImage = await ImageModel.findOneAndUpdate(
      { id: imageId },
      { $set: req.body },
      { returnDocument: "after", runValidators: true },
    );

    return res
      .status(200)
      .json({ message: "Image updated successfully", image: updatedImage });
  } catch (error) {
    console.error("UPDATE_IMAGE_BY_ID error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// TODO: Later, when image reorder/move is implemented,
// review whether order values should be reindexed after delete.

const DELETE_IMAGE_BY_ID = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await ImageModel.findOne({ id: imageId });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const board = await BoardModel.findOne({
      id: image.boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Image not found" });
    }

    await ImageModel.deleteOne({ id: imageId });

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_IMAGE_BY_ID error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  GET_IMAGES_BY_BOARD,
  CREATE_IMAGE_BY_URL,
  GET_IMAGE_BY_ID,
  UPDATE_IMAGE_BY_ID,
  DELETE_IMAGE_BY_ID,
};
