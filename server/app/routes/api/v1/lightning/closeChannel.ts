import { Router } from "express";
import { closeChannel, getChainBalance, getChannels } from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/lightning/closeChannel:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).post(
  "/v1/lightning/closeChannel",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.body;
      const response = await closeChannel({ id, lnd });

      res.json(response);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
