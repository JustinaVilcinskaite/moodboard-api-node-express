import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      userId: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
};

export default generateToken;