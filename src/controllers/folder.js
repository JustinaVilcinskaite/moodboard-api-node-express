import BoardModel from "../models/board.js";
import FolderModel from "../models/folder.js";
import ImageModel from "../models/image.js";

const GET_FOLDERS_BY_BOARD_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const folders = await FolderModel.find({ boardId }).sort({
      order: 1,
    });

    return res.status(200).json({ folders });
  } catch (error) {
    console.error("GET_FOLDERS_BY_BOARD_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const CREATE_FOLDER_FOR_BOARD = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const lastFolder = await FolderModel.findOne({ boardId }).sort({
      order: -1,
    });

    const newOrder = lastFolder ? lastFolder.order + 1 : 0;

    const folder = new FolderModel({
      boardId: boardId,
      title,
      order: newOrder,
      isDefault: false,
    });

    await folder.save();

    return res.status(201).json({ message: "Folder has been added", folder });
  } catch (error) {
    console.error("CREATE_FOLDER_FOR_BOARD error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const REORDER_FOLDERS_BY_BOARD = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { folderIds } = req.body;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const folders = await FolderModel.find({ boardId });

    const defaultFolder = folders.find((folder) => folder.isDefault);
    if (!defaultFolder) {
      return res.status(400).json({ message: "Default folder is missing" });
    }

    const reorderableFolderIds = folders
      .filter((folder) => !folder.isDefault)
      .map((folder) => folder.id);

    const hasInvalidIds = folderIds.some(
      (id) => !reorderableFolderIds.includes(id),
    );

    if (hasInvalidIds) {
      return res.status(400).json({ message: "Invalid folder order data" });
    }

    const bulkUpdates = [
      {
        updateOne: {
          filter: { id: defaultFolder.id },
          update: { $set: { order: 0 } },
        },
      },
      ...folderIds.map((folderId, index) => ({
        updateOne: {
          filter: { id: folderId, boardId },
          update: { $set: { order: index + 1 } },
        },
      })),
    ];

    await FolderModel.bulkWrite(bulkUpdates);

    const updatedFolders = await FolderModel.find({ boardId }).sort({
      order: 1,
    });

    return res.status(200).json({
      message: "Folders reordered successfully",
      folders: updatedFolders,
    });
  } catch (error) {
    console.error("REORDER_FOLDERS_BY_BOARD error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const UPDATE_FOLDER_BY_ID = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await FolderModel.findOne({ id: folderId });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const board = await BoardModel.findOne({
      id: folder.boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const updatedFolder = await FolderModel.findOneAndUpdate(
      { id: folderId },
      { $set: req.body },
      { new: true },
    );

    return res.status(200).json({
      message: "Folder has been updated",
      folder: updatedFolder,
    });
  } catch (error) {
    console.error("UPDATE_FOLDER_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// TODO: Later, when image reorder is implemented,
// review whether moved images should receive new order values in the default folder.
const DELETE_FOLDER_BY_ID = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await FolderModel.findOne({ id: folderId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (folder.isDefault) {
      return res
        .status(400)
        .json({ message: "Default folder cannot be deleted" });
    }

    const board = await BoardModel.findOne({
      id: folder.boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Folder not found" });
    }
    await ImageModel.updateMany(
      { folderId, boardId: board.id },
      { $set: { folderId: board.defaultFolderId } },
    );

    await FolderModel.deleteOne({ id: folderId });

    return res.status(200).json({
      message: "Folder has been deleted",
      folder,
    });
  } catch (error) {
    console.error("DELETE_FOLDER_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_PUBLIC_FOLDERS_BY_BOARD_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
      isPublic: true,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const folders = await FolderModel.find({ boardId: boardId }).sort({
      order: 1,
    });

    return res.status(200).json({ folders });
  } catch (error) {
    console.error("GET_PUBLIC_FOLDERS_BY_BOARD_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  GET_FOLDERS_BY_BOARD_ID,
  CREATE_FOLDER_FOR_BOARD,
  UPDATE_FOLDER_BY_ID,
  DELETE_FOLDER_BY_ID,
  GET_PUBLIC_FOLDERS_BY_BOARD_ID,
  REORDER_FOLDERS_BY_BOARD,
};
