import { Router } from "express";
import { authenticatedLndGrpc } from "lightning";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - auth
 */
export default Router({ mergeParams: true }).post(
  "/v1/auth/login",
  async (req, res) => {
    try {
      const { password } = req.body;

      if (password === process.env.PASSWORD) {
        const token = jwt.sign(
          {
            password,
          },
          process.env.TOKEN_SECRET!
        );

        res.json({
          bearerToken: token,
        });
      } else {
        res.status(400).json({
          message: "Failed to authenticate",
        });
      }
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
