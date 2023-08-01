// import { Router } from "express";
// import { getChainBalance, getPendingChainBalance } from "lightning";
// import { lnd } from "../../../../config/lndClient.js";
// import { authenticateToken } from "../../../../middleware/auth.middleware.js";

// /**
//  * @swagger
//  * /api/v1/bitcoin/pendingBalance:
//  *   get:
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: OK
//  *       400:
//  *         description: Error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 error:
//  *                   type: string
//  *     tags:
//  *       - bitcoin
//  */
// export default Router({ mergeParams: true }).get(
//   "/v1/bitcoin/pendingBalance",
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const balance = (await getPendingChainBalance({ lnd }))
//         .pending_chain_balance;

//       res.json(balance);
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
