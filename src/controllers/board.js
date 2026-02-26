// import { v4 as uuidv4 } from "uuid";
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
    });

    await board.save();

    return res.status(201).json({ message: "Board has been added", board });
  } catch (error) {
    console.error("CREATE_BOARD error:", error);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_BOARD_BY_ID = (req, res) => {};

const UPDATE_BOARD_BY_ID = (req, res) => {};

const DELETE_BOARD_BY_ID = (req, res) => {};

const GET_ALL_PUBLIC_BOARDS = (req, res) => {};

const GET_PUBLIC_BOARD_BY_ID = (req, res) => {};

export {
  GET_MY_BOARDS,
  CREATE_BOARD,
  GET_BOARD_BY_ID,
  UPDATE_BOARD_BY_ID,
  DELETE_BOARD_BY_ID,
  GET_ALL_PUBLIC_BOARDS,
  GET_PUBLIC_BOARD_BY_ID,
};
