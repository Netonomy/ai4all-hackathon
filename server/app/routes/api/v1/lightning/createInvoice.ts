import { Router } from "express";
import {
  closeChannel,
  createInvoice,
  getChainBalance,
  getChannels,
} from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/lightning/createInvoice:
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
 *               mtokens:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).post(
  "/v1/lightning/createInvoice",
  authenticateToken,
  async (req, res) => {
    try {
      const { mtokens } = req.body;

      const invoice = await createInvoice({ lnd, mtokens });

      res.json(invoice);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
