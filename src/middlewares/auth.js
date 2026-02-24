import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorizarion;

    if (!token) {
      return res.status(401).json({ message: "Auth failed" });
    }

    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = decodedInfo.userId;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Auth failed" });
  }
};

export default authUser;
