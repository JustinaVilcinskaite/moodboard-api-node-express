import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const SIGN_UP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hash,
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("SIGN_UP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const LOGIN = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("LOGIN error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const GET_ME = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.userId }).select(
      "-_id id name email createdAt updatedAt",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GET_ME error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { SIGN_UP, LOGIN, GET_ME };
