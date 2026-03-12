import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Auth failed" });
    }

    const token = authHeader.split(" ")[1];

    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedInfo.userId;

    return next();
  } catch (error) {
    console.error("authUser middleware error:", error);
    return res.status(401).json({ message: "Auth failed" });
  }
};

export default authUser;

// import jwt from "jsonwebtoken";

// const authUser = (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res.status(401).json({ message: "Auth failed" });
//     }

//     const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

//     req.userId = decodedInfo.userId;

//     return next();
//   } catch (error) {
//     console.error("authUser middleware error:", error);
//     return res.status(401).json({ message: "Auth failed" });
//   }
// };

// export default authUser;
