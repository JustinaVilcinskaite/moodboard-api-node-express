import { v4 as uuidv4 } from "uuid";
import BoardModel from "../models/board.js";

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
      message: "Error in application",
    });
  }
};

const CREATE_BOARD = async (req, res) => {
  try {
    const board = new BoardModel({
      title: req.body.title,
      description: req.body.description,
      ownerId: req.userId,
      // ?
      isPublic: req.body.isPublic ?? false,
      defaultFolderId: uuidv4(),
    });

    await board.save();

    return res.status(201).json({ message: "Board has been added", board });
  } catch (error) {
    console.error("CREATE_BOARD error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_BOARD_BY_ID = async (req, res) => {
  try {
    // const id = req.params.id;
    const { id } = req.params;

    const board = await BoardModel.findOne({ id, ownerId: req.userId });

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
    const { id } = req.params;

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
      { id, ownerId: req.userId },
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
//     const { id } = req.params;

// // Only updating editable fields explicitly (prevents updating ownerId etc.)

// // Only updating editable fields explicitly
// // Prevents accidental update of protected fields

//     const updatedBoard = await BoardModel.findOneAndUpdate(
//       { id, ownerId: req.userId },
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
//     const id = req.params.id;

//     const board = await BoardModel.findOne({ id: id });

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
//       { id: id },
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
    const { id } = req.params;

    const board = await BoardModel.findOneAndDelete({
      id,
      ownerId: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

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
    const { id } = req.params;

    const board = await BoardModel.findOne({ id, isPublic: true });

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
