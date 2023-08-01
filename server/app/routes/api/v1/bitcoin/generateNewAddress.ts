// import { Router } from "express";
// import { createChainAddress, getChainBalance } from "lightning";
// import { lnd } from "../../../../config/lndClient.js";
// import { authenticateToken } from "../../../../middleware/auth.middleware.js";

// /**
//  * @swagger
//  * /api/v1/bitcoin/generateNewAddress:
//  *   post:
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
// export default Router({ mergeParams: true }).post(
//   "/v1/bitcoin/generateNewAddress",
//   // authenticateToken,
//   async (req, res) => {
//     try {
//       const format = "p2wpkh";
//       const address = (await createChainAddress({ lnd, format })).address;

//       res.json(address);
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
