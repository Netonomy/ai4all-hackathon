import { Router } from "express";
import { openChannel } from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/lightning/openChannel:
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
 *               local_tokens:
 *                 type: number
 *                 required: true
 *               partner_public_key:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).post(
  "/v1/lightning/openChannel",
  //   authenticateToken,
  async (req, res) => {
    try {
      const { local_tokens, partner_public_key } = req.body;

      const channel = await openChannel({
        lnd,
        local_tokens,
        partner_public_key,
      });

      res.json(channel);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
