import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SIGN_UP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Synchronous bcrypt version (blocks event loop)

    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(req.body.password, salt);

    // const user = new UserModel({
    //   name,
    //   email,
    //   password: hash,
    // });

    // await user.save();

    // Async version with manual salt

    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(password, salt);

    // Async hash with internal salt generation (non-blocking)

    const hash = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hash,
    });

    await user.save();

    return res.status(201).json({
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

    // const isPasswordMatch = bcrypt.compareSync(
    //   req.body.password,
    //   user.password,
    // );

    // non-blocking
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      message: "Login was successful",
    });
  } catch (error) {
    console.error("LOGIN error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// TODO: later VALIDATE_LOGIN
const VALIDATE_LOGIN = (req, res) => {};

export { SIGN_UP, LOGIN, VALIDATE_LOGIN };
