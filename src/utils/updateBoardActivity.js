import BoardModel from "../models/board.js";

export const updateBoardActivity = async (boardId) => {
  await BoardModel.updateOne(
    { id: boardId },
    { $set: { updatedAt: new Date() } },
  );
};