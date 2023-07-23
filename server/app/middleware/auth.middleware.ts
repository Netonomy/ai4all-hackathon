import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(req: Request, res: Response, next: any) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      (req as any).user = user;

      next();
    }
  );
}
