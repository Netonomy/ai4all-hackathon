// import { Router } from "express";
// import { payViaPaymentRequest } from "lightning";
// import { lnd } from "../../../../config/lndClient.js";
// import { authenticateToken } from "../../../../middleware/auth.middleware.js";

// /**
//  * @swagger
//  * /api/v1/lightning/payViaPaymentRequest:
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
//  *               request:
//  *                 type: string
//  *                 required: true
//  *                 description: bol11 payment request string
//  *     responses:
//  *       200:
//  *         description: OK
//  *     tags:
//  *       - lightning
//  */
// export default Router({ mergeParams: true }).post(
//   "/v1/lightning/payViaPaymentRequest",
//   //   authenticateToken,
//   async (req, res) => {
//     try {
//       const { request } = req.body;

//       const response = await payViaPaymentRequest({ lnd, request });

//       res.json(response);
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
