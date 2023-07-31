import { Router } from "express";
import { getChannelBalance, openChannel } from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/lightning/channelBalance:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lightning
 */
export default Router({ mergeParams: true }).get(
  "/v1/lightning/channelBalance",
  //   authenticateToken,
  async (req, res) => {
    try {
      const balance = await getChannelBalance({ lnd });

      res.json(balance);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
