import { Router } from "express";
import { getChainBalance, getChannels } from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/lightning/openChannels:
 *   get:
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 error:
 *                   type: string
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).get(
  "/v1/lightning/openChannels",
  authenticateToken,
  async (req, res) => {
    try {
      const channels = (await getChannels({ lnd })).channels;

      res.json(channels);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
