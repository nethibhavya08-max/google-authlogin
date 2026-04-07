import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
 const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
   console.log("DECODED:", decoded); 
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};