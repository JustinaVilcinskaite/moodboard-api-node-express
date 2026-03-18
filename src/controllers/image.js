import BoardModel from "../models/board.js";
import FolderModel from "../models/folder.js";
import ImageModel from "../models/image.js";

// TODO: Later decide whether folder-specific image view should use
// a query param on this endpoint or a separate folder-images endpoint.
const GET_IMAGES_BY_BOARD = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const images = await ImageModel.find({ boardId }).sort({
      createdAt: -1,
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

    // TODO: maybe later use create()

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

    return res.status(200).json({ image });
  } catch (error) {
    console.error("GET_IMAGE_BY_ID error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Phase 1 - later do image reorder

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

const GET_PUBLIC_IMAGES_BY_BOARD = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({ id: boardId, isPublic: true });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const images = await ImageModel.find({ boardId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ images });
  } catch (error) {
    console.error("GET_PUBLIC_IMAGES_BY_BOARD error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const GET_PUBLIC_IMAGE_BY_ID = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await ImageModel.findOne({ id: imageId });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const board = await BoardModel.findOne({
      id: image.boardId,
      isPublic: true,
    });

    if (!board) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({ image });
  } catch (error) {
    console.error("GET_PUBLIC_IMAGE_BY_ID error:", error);
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
  GET_PUBLIC_IMAGES_BY_BOARD,
  GET_PUBLIC_IMAGE_BY_ID,
};
