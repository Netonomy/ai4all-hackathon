import { Router } from "express";
import { getChainTransactions } from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/bitcoin/transactions:
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
 *       - bitcoin
 */
export default Router({ mergeParams: true }).get(
  "/v1/bitcoin/transactions",
  authenticateToken,
  async (req, res) => {
    try {
      const transactions = (await getChainTransactions({ lnd })).transactions;

      res.json(transactions);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
