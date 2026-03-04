import { v4 as uuidv4 } from "uuid";
import BoardModel from "../models/board.js";
import FolderModel from "../models/folder.js";

const GET_MY_BOARDS = async (req, res) => {
  try {
    const boards = await BoardModel.find({ ownerId: req.userId }).sort({
      createdAt: -1,
    });

    // TODO: no boards yet if the user has no boards

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
      title: req.body.title,
      description: req.body.description,
      ownerId: req.userId,
      // ?
      isPublic: req.body.isPublic ?? false,
      defaultFolderId: defaultFolderId,
    });

    // Save both; if board save fails after folder save, delete the folder
    // TODO: add boardId when addding more folders
    try {
      await defaultFolder.save();
      await board.save();
    } catch (err) {
      await FolderModel.deleteOne({ id: defaultFolderId }).catch(() => {});
      throw err;
    }

    return res
      .status(201)
      .json({ message: "Board has been added", board, defaultFolder });
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

    // FIX: if does not belong to user auth but not board not found

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
// - Only specific fields are allowed to be updated.
// - Uses MongoDB $set operator to update selected fields.

const UPDATE_BOARD_BY_ID = async (req, res) => {
  try {
    const { boardId } = req.params;

    // List of fields that are allowed to be updated
    // This prevents updating protected fields like ownerId, defaultFolderId, etc.
    const allowedUpdates = ["title", "description", "isPublic"];

    // Object that will contain only safe fields to update
    const updates = {};

    //  Option 1: for loop
    //  Loops through array using index.

    //     for (let i = 0; i < allowedUpdates.length; i++) {
    //   const key = allowedUpdates[i];

    //   if (req.body[key] !== undefined) {
    //     updates[key] = req.body[key];
    //   }
    // }

    // Option 2: forEach loop
    // Iterates over array values directly.
    // Cannot use return inside.

    // allowedUpdates.forEach((key) => {
    //   if (req.body[key] !== undefined) {
    //     updates[key] = req.body[key];
    //   }
    // });

    // Option 3: for...of loop
    // Clean syntax for iterating over array values.
    // Most common in modern backend JS.
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    //  Update board:
    //  - Filter ensures board belongs to logged-in user
    //  - $set updates only provided fields
    //  - new: true returns updated document
    //  - runValidators: true enforces schema validation rules

    const updatedBoard = await BoardModel.findOneAndUpdate(
      { id: boardId, ownerId: req.userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

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

// UPDATE_BOARD_BY_ID (Explicit field mapping version)
// Updates board by explicitly listing editable fields.
// Simple and very readable approach.

// const UPDATE_BOARD_BY_ID = async (req, res) => {
//   try {
//     const { boardId} = req.params;

// // Only updating editable fields explicitly (prevents updating ownerId etc.)

// // Only updating editable fields explicitly
// // Prevents accidental update of protected fields

//     const updatedBoard = await BoardModel.findOneAndUpdate(
//       { id: boardId, ownerId: req.userId },
//       {
//         title: req.body.title,
//         description: req.body.description,
//         isPublic: req.body.isPublic,
//       },
//       { new: true, runValidators: true },
//     );

//     if (!updatedBoard) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     return res.status(200).json({
//       message: "Board updated successfully",
//       board: updatedBoard,
//     });
//   } catch (error) {
//     console.error("UPDATE_BOARD_BY_ID error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

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

    const board = await BoardModel.findOneAndDelete({
      id: boardId,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await FolderModel.deleteMany({ boardId: boardId });

    // TODO: Later Delete images too

    return res.status(200).json({
      message: "Board was deleted",
      board,
    });
  } catch (error) {
    console.error("DELETE_BOARD_BY_ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_ALL_PUBLIC_BOARDS = async (req, res) => {
  try {
    const boards = await BoardModel.find({ isPublic: true })
      .select("id title description createdAt")
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

    const board = await BoardModel.findOne({ id: boardId, isPublic: true });

    if (!board) {
      return res.status(404).json({ board });
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
