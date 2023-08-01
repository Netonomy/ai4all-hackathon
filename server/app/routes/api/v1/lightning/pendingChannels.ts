// import { Router } from "express";
// import { getChainBalance, getChannels, getPendingChannels } from "lightning";
// import { lnd } from "../../../../config/lndClient.js";
// import { authenticateToken } from "../../../../middleware/auth.middleware.js";

// /**
//  * @swagger
//  * /api/v1/lightning/pendingChannels:
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
//  *       - lightning
//  */
// export default Router({ mergeParams: true }).get(
//   "/v1/lightning/pendingChannels",
//   // authenticateToken,
//   async (req, res) => {
//     try {
//       const channels = (await getPendingChannels({ lnd })).pending_channels;

//       res.json(channels);
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
