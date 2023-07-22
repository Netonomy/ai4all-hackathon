import { Router } from "express";
import { addPeer, closeChannel, getChainBalance, getChannels } from "lightning";
import { lnd } from "../../../../config/lndClient.js";

/**
 * @swagger
 * /api/v1/lightning/addPeer:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicKey:
 *                 type: string
 *                 required: true
 *               socket:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).post(
  "/v1/lightning/addPeer",
  async (req, res) => {
    try {
      const { publicKey, socket } = req.body;

      const response = await addPeer({ public_key: publicKey, lnd, socket });

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
