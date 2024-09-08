import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    ); // Verifica el token
    res.locals.user = decoded;
    next(); // Continúa con la solicitud
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authenticateJWT;
