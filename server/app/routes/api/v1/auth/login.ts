// import { Router } from "express";
// import { authenticatedLndGrpc, getWalletInfo } from "lightning";
// import jwt from "jsonwebtoken";

// /**
//  * @swagger
//  * /api/v1/auth/login:
//  *   post:
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               macaroon:
//  *                 type: string
//  *                 required: true
//  *     responses:
//  *       200:
//  *         description: OK
//  *     tags:
//  *       - auth
//  */
// export default Router({ mergeParams: true }).post(
//   "/v1/auth/login",
//   async (req, res) => {
//     try {
//       const { macaroon } = req.body;

//       const { lnd } = authenticatedLndGrpc({
//         macaroon: macaroon,
//         socket: process.env.LND_ENDPOINT,
//       });

//       const walletInfo = await getWalletInfo({ lnd });

//       if (walletInfo) {
//         const token = jwt.sign(
//           {
//             macaroon,
//           },
//           process.env.TOKEN_SECRET!
//         );

//         res.json({
//           bearerToken: token,
//         });
//       } else {
//         res.status(400).json({
//           message: "Failed to authenticate",
//         });
//       }
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         message: "Failed to authenticate",
//       });
//     }
//   }
// );
