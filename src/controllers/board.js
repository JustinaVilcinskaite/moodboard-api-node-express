import { v4 as uuidv4 } from "uuid";
import BoardModel from "../models/board.js";
import FolderModel from "../models/folder.js";
import ImageModel from "../models/image.js";

const GET_MY_BOARDS = async (req, res) => {
  try {
    const boards = await BoardModel.find({ ownerId: req.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      boards,
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

    // 1) Create default folder FIRST
    const defaultFolder = new FolderModel({
      id: defaultFolderId,
      boardId: boardId,
      title: "General",
      order: 0,
      isDefault: true,
    });

    // 2) Create board SECOND (now we can safely reference defaultFolderId)

    const board = new BoardModel({
      id: boardId,
      title,
      description,
      ownerId: req.userId,
      // ?
      isPublic: isPublic ?? false,
      defaultFolderId,
    });

    await defaultFolder.save();
    // If board creation fails after folder is saved,
    // remove the folder to avoid leaving orphan data.
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
    // const boardId = req.params.id;
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

// UPDATE_BOARD_BY_ID
// - Only the board owner can update it.
// - Uses MongoDB $set operator to update selected fields.

const UPDATE_BOARD_BY_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    //  Update board:
    //  - Filter ensures board belongs to logged-in user
    //  - $set updates only provided fields
    //  - new: true returns updated document
    //  - runValidators: true enforces schema validation rules

    const updatedBoard = await BoardModel.findOneAndUpdate(
      { id: boardId, ownerId: req.userId },
      { $set: req.body },
      { returnDocument: "after", runValidators: true },
    );

    // why check after? should wonershio shoul be checked before
    // If no board found (either doesn't exist or not owned by user)
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

//  UPDATE_BOARD_BY_ID (Basic version - less secure)

//  - First fetches board
//  - Then checks ownership manually
//  - Spreads entire req.body (can be unsafe)
//  This works but may allow unintended field updates.

// const UPDATE_BOARD_BY_ID = async (req, res) => {
//   try {
//     const boardId = req.params.boardId

//     const board = await BoardModel.findOne({ id: boardId });

//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     if (board.ownerId !== req.userId) {
//       return res.status(403).json({
//         message: "You can only update board that belongs to your account",
//       });
//     }

// //  Spreading req.body may allow updating protected fields
//     const updatedBoard = await BoardModel.findOneAndUpdate(
//       { id: boardId },
//       { ...req.body },
//       { new: true },
//     );

//     return res.status(200).json({
//       message: "Board has been updated successfully",
//       board: updatedBoard,
//     });
//   } catch (error) {
//     console.error("UPDATE_BOARD_BY_ID error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

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

    return res.status(200).json({ boards });
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
