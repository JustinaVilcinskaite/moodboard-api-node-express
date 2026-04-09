import { v4 as uuidv4 } from "uuid";
import BoardModel from "../models/board.js";
import FolderModel from "../models/folder.js";
import ImageModel from "../models/image.js";

// TODO: Later refactor to Aggregation-based summary query

const GET_MY_BOARDS = async (req, res) => {
  try {
    const boards = await BoardModel.find({ ownerId: req.userId }).sort({
      createdAt: -1,
    });

    const boardsWithSummary = await Promise.all(
      boards.map(async (board) => {
        const images = await ImageModel.find({ boardId: board.id }).sort({
          createdAt: 1,
        });

        return {
          ...board.toObject(),
          thumbnailUrl: images.length ? images[0].url : "",
          imageCount: images.length,
        };
      }),
    );

    return res.status(200).json({
      boards: boardsWithSummary,
    });
  } catch (error) {
    console.error("GET_MY_BOARDS error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const CREATE_BOARD = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    const boardId = uuidv4();
    const defaultFolderId = uuidv4();

    const defaultFolder = new FolderModel({
      id: defaultFolderId,
      boardId: boardId,
      title: "General",
      order: 0,
      isDefault: true,
    });

    const board = new BoardModel({
      id: boardId,
      title,
      description,
      ownerId: req.userId,
      isPublic: isPublic ?? false,
      defaultFolderId,
    });

    await defaultFolder.save();

    try {
      await board.save();
    } catch (error) {
      await FolderModel.deleteOne({ id: defaultFolderId }).catch(() => {});
      throw error;
    }

    return res
      .status(201)
      .json({ message: "Board created successfully", board, defaultFolder });
  } catch (error) {
    console.error("CREATE_BOARD error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_BOARD_BY_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json({ board });
  } catch (error) {
    console.error("GET_BOARD_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const UPDATE_BOARD_BY_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    const updatedBoard = await BoardModel.findOneAndUpdate(
      { id: boardId, ownerId: req.userId },
      { $set: req.body },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json({
      message: "Board updated successfully",
      board: updatedBoard,
    });
  } catch (error) {
    console.error("UPDATE_BOARD_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const DELETE_BOARD_BY_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await ImageModel.deleteMany({ boardId });
    await FolderModel.deleteMany({ boardId });
    await BoardModel.deleteOne({ id: boardId, ownerId: req.userId });

    return res.status(200).json({
      message: "Board was deleted",
    });
  } catch (error) {
    console.error("DELETE_BOARD_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_ALL_PUBLIC_BOARDS = async (req, res) => {
  try {
    const boards = await BoardModel.find({ isPublic: true })
      .select("id title description createdAt updatedAt -_id")
      .sort({
        createdAt: -1,
      });

    const publicBoardsWithThumbnail = await Promise.all(
      boards.map(async (board) => {
        const firstImage = await ImageModel.findOne({ boardId: board.id }).sort(
          {
            createdAt: 1,
          },
        );

        return {
          ...board.toObject(),
          thumbnailUrl: firstImage ? firstImage.url : "",
        };
      }),
    );

    return res.status(200).json({ boards: publicBoardsWithThumbnail });
  } catch (error) {
    console.error("GET_ALL_PUBLIC_BOARDS error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_PUBLIC_BOARD_BY_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await BoardModel.findOne({
      id: boardId,
      isPublic: true,
    }).select("id title description createdAt updatedAt -_id");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json({ board });
  } catch (error) {
    console.error("GET_PUBLIC_BOARD_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  GET_MY_BOARDS,
  CREATE_BOARD,
  GET_BOARD_BY_ID,
  UPDATE_BOARD_BY_ID,
  DELETE_BOARD_BY_ID,
  GET_ALL_PUBLIC_BOARDS,
  GET_PUBLIC_BOARD_BY_ID,
};
