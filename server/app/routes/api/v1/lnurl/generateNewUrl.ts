// import { Router } from "express";
// import { bech32 } from "bech32";
// import crypto from "crypto";
// import base64url from "base64url";
// import queryString from "query-string";

// /**
//  * @swagger
//  * /api/v1/lnurl/generateNewUrl/{pubKey}:
//  *   get:
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: pubKey
//  *         type: string
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: OK
//  *     tags:
//  *       - lnurl
//  */
// export default Router({ mergeParams: true }).get(
//   "/v1/lnurl/generateNewUrl/:pubKey",
//   //   authenticateToken,
//   async (req, res) => {
//     try {
//       const pubKey = req.params.pubKey;
//       if (!pubKey)
//         return res.status(400).json({
//           status: "FAILED",
//           messsge: "no pub key provided",
//         });

//       const tag = "payRequest";
//       const params: any = {
//         minSendable: 10000,
//         maxSendable: 200000,
//         metadata: '[["text/plain", "lnurl-node"]]',
//         allowsNostr: true,
//         nostrPubKey: pubKey,
//         commentAllowed: 500,
//       };

//       // Generate a new unique secret for this LNURL
//       const secret = crypto.randomBytes(32).toString("hex");

//       // Add the secret and the tag to your params
//       params.secret = secret;
//       params.tag = tag;

//       // Convert the parameters to a base64 encoded query string
//       const encodedParams = base64url(queryString.stringify(params));

//       // Create the full URL
//       const url = `http://localhost:3300/api/v1/lnurl?q=${encodedParams}`;

//       // Convert the URL to a bech32-encoded LNURL
//       let words = bech32.toWords(Buffer.from(url, "utf8"));
//       let encoded = bech32.encode("lnurl", words, 1024);

//       res.json({
//         url,
//         encoded,
//       });
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({
//         status: "FAILED",
//         error: err.message,
//       });
//     }
//   }
// );
