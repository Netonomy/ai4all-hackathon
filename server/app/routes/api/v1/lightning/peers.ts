import { Router } from "express";
import { getPeers } from "lightning";
import { lnd } from "../../../../config/lndClient.js";

/**
 * @swagger
 * /api/v1/lightning/peers:
 *   get:
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).get(
  "/v1/lightning/peers",
  async (req, res) => {
    try {
      const peers = (await getPeers({ lnd })).peers;

      res.json(peers);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
