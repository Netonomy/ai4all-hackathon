// import { Router } from "express";
// import {
//   getChainBalance,
//   getPendingChainBalance,
//   sendToChainAddress,
// } from "lightning";
// import { lnd } from "../../../../config/lndClient.js";
// import { authenticateToken } from "../../../../middleware/auth.middleware.js";

// /**
//  * @swagger
//  * /api/v1/bitcoin/sendToAddress:
//  *   post:
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               address:
//  *                 type: string
//  *                 required: true
//  *               amount:
//  *                 type: number
//  *                 required: true
//  *     responses:
//  *       200:
//  *         description: OK
//  *     tags:
//  *       - bitcoin
//  */
// export default Router({ mergeParams: true }).post(
//   "/v1/bitcoin/sendToAddress",
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const { address, amount } = req.body;

//       const result = await sendToChainAddress({
//         address,
//         lnd,
//         tokens: amount,
//       });

//       res.json(result);
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
