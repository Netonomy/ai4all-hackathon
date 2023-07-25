import { Router } from "express";
import base64url from "base64url";
import queryString from "query-string";
import { lnd } from "../../../../config/lndClient.js";
import { createInvoice } from "lightning";
import Joi from "joi";
import bech32 from "bech32";

const schema = Joi.object({
  amount: Joi.string().required(),
  nostr: Joi.string().optional(),
});

/**
 * @swagger
 * /api/v1/lnurl/{q}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: q
 *         type: string
 *         required: true
 *       - in: query
 *         name: amount
 *         type: number
 *         required: true
 *       - in: query
 *         name: nostr
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lnurl
 */
export default Router({ mergeParams: true }).get(
  "/v1/lnurl/:q",
  //   authenticateToken,
  async (req, res) => {
    try {
      const q = req.params.q;

      const { amount, nostr } = req.query;

      // base64url decode and parse the parameters
      const decodedParams = queryString.parse(base64url.decode(q));

      const {
        tag,
        minSendable,
        maxSendable,
        metadata,
        allowsNostr,
        nostrPubKey,
        commentAllowed,
      } = decodedParams;

      const invoice = await createInvoice({ lnd, mtokens: amount as string });

      res.json({
        pr: invoice.request,
        routes: [],
      });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
