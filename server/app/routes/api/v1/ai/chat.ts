import { Router } from "express";
import { HumanMessage, AIMessage } from "langchain/schema";
import { agentExecutor, dwn } from "../../../../config/web5AndAgentExecutor.js";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";
import { L402Auth } from "../../../../middleware/l402.middlewate.js";

/**
 * @swagger
 * /api/v1/ai/chat:
 *   post:
 *     description: Chat with your AI Agent
 *     security:
 *       - macaroonAuth: []
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
  // L402Auth,
  authenticateToken,
  async (req, res) => {
    try {
      const { input } = req.body;

      const humanMessage = new HumanMessage({
        content: input,
      });

      await dwn.records.create({
        data: humanMessage.toJSON(),
        message: {
          schema: "https://langchain.com/chatMessage",
        },
      });

      await agentExecutor.run(input, [
        {
          handleAgentAction(action, runId) {
            console.log("\nhandleAgentAction", action, runId);

            res.write(
              JSON.stringify({
                type: "agentAction",
                action,
              })
            );
          },
          async handleAgentEnd(action, runId) {
            console.log("\nhandleAgentEnd", action, runId);

            const aiMessage = new AIMessage({
              content: action.returnValues.output,
            });

            await dwn.records.create({
              data: aiMessage.toJSON(),
              message: {
                schema: "https://langchain.com/chatMessage",
              },
            });

            res.write(
              JSON.stringify({
                type: "agentEnd",
                action,
              })
            );

            res.end();
          },
          handleToolEnd(output, runId) {
            console.log("\nhandleToolEnd", output, runId);

            res.write(
              JSON.stringify({
                type: "toolEnd",
                output,
              })
            );
          },
        },
      ]);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        status: "FAILED",
        error: err.message,
      });
    }
  }
);
