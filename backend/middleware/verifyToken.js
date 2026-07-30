import jwt from "jsonwebtoken";

// Ye middleware har protected route se pehle chalega
// Frontend se "Authorization: Bearer <accessToken>" header expect karta hai
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer xxxxx" -> "xxxxx"

  if (!token) {
    return res.status(401).json({ message: "Access token missing hai" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Expired ya invalid token - frontend isko dekh kar /refresh call karega
      return res.status(403).json({ message: "Access token invalid ya expired hai" });
    }
    req.userId = decoded.userId; // aage ke route handlers ke liye user id attach kar di
    next();
  });
};

export default verifyToken;
