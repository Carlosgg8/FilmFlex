import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" });
    }

    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticateJWT;