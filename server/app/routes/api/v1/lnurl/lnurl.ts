import { Router } from "express";
import base64url from "base64url";
import queryString from "query-string";

/**
 * @swagger
 * /api/v1/lnurl:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *     tags:
 *       - lnurl
 */
export default Router({ mergeParams: true }).get(
  "/v1/lnurl",
  //   authenticateToken,
  async (req, res) => {
    try {
      const { q } = req.query;

      if (!q)
        return res.status(400).json({
          status: "FAILED",
          message: "no q params",
        });

      // base64url decode and parse the parameters
      const decodedParams = queryString.parse(base64url.decode(q as string));

      const {
        tag,
        minSendable,
        maxSendable,
        metadata,
        allowsNostr,
        nostrPubKey,
        commentAllowed,
      } = decodedParams;

      res.json({
        tag,
        minSendable: Number(minSendable),
        maxSendable: Number(maxSendable),
        metadata,
        allowsNostr: Boolean(allowsNostr),
        nostrPubKey,
        commentAllowed: parseInt(commentAllowed as string),
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
