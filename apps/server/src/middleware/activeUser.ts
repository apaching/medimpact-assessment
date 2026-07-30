import type { Request, Response, NextFunction } from "express";
import { findById } from "../models/mysql/users.js";

export async function requireActiveUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  const user = await findById(req.user.userId);
  if (!user || user.status !== "active") {
    return res.status(403).json({ error: "Your account is not active." });
  }

  next();
}
