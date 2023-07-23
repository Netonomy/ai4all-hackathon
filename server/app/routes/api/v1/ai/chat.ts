import { Router } from "express";
import { HumanMessage, AIMessage } from "langchain/schema";
import { babyAGI, dwn } from "../../../../config/web5AndAgentExecutor.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v1/ai/chat:
 *   post:
 *     description: Chat with your AI Agent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 required: true
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
 *       - ai
 */
export default Router({ mergeParams: true }).post(
  "/v1/ai/chat",
  authenticateToken,
  async (req, res) => {
    try {
      const { input } = req.body;

      const result = await babyAGI.call({
        objective: input,
      });

      res.json(result);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
