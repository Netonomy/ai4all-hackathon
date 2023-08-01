import { Router } from "express";
import { HumanMessage, AIMessage } from "langchain/schema";
import { authenticateToken } from "../../../../middleware/auth.middleware.js";
import {
  DynamicStructuredTool,
  DynamicTool,
  StructuredTool,
  Tool,
} from "langchain/tools";
import { createChainAddress } from "lightning";
import { lnd } from "../../../../config/lndClient.js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { z } from "zod";
import "websocket-polyfill";

import {
  SimplePool,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
} from "nostr-tools";
import { L402Auth } from "../../../../middleware/l402.middlewate.js";

let sk = generatePrivateKey(); // `sk` is a hex string
let pk = getPublicKey(sk); // `pk` is a hex string

const pool = new SimplePool();

let relays = [
  // "wss://brb.io",
  "wss://eden.nostr.land",
  "wss://nos.lol",
  "wss://nostr.mom",
  "wss://relay.current.fyi",
  "wss://relay.damus.io",
  "wss://relay.snort.social",
];

async function publishJob(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create Job Request for algorithmic feed
    let jobRequestEvent: any = {
      kind: 65006,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["output", "application/json"]],
      content: "",
    };
    jobRequestEvent.id = getEventHash(jobRequestEvent);
    jobRequestEvent.sig = getSignature(jobRequestEvent, sk);

    // Publish Job
    let pubs = pool.publish(relays, jobRequestEvent);
    pubs.on("ok", () => {
      console.log("published okay");
      resolve(jobRequestEvent.id);
    });
    pubs.on("failed", () => {
      console.log("Failed to publish job result");
      reject(`Failed to publish event: ${JSON.stringify(jobRequestEvent)}`);
    });
  });
}

async function getJobDetails(eventId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pubs = pool.sub(relays, [
      {
        "#e": [eventId],
        kinds: [65001, 65000],
      },
    ]);

    let eventIds: any = [];

    pubs.on("event", (event: any) => {
      eventIds.push(event.id);
      console.log(event);
    });
    pubs.on("eose", () => {
      resolve(JSON.stringify(eventIds));
    });
  });
}

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
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                     content:
 *                       type: string
 *               input:
 *                 type: string
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
  L402Auth,
  async (req, res) => {
    try {
      let tools: Tool | StructuredTool[] = [
        new DynamicTool({
          name: "current-date",
          description: "useful when you need to know the current date",
          func: async () => {
            return new Date().toLocaleDateString();
          },
        }),
        new DynamicTool({
          name: "nostr-algo-feed-job-request",
          description:
            "useful when you want to publish a job request to nostr for an algorithmic event feed",
          func: async () => {
            const jobRes = await publishJob();
            return jobRes;
          },
        }),
        // new DynamicStructuredTool({
        //   name: "nostr-job-results",
        //   description:
        //     "Useful when you want to get job results of a published job. Returns a list of event ids.",
        //   schema: z.object({
        //     eventId: z.string().describe("nostr job event id"),
        //   }),
        //   func: async ({ eventId }) => {
        //     const events = await getJobDetails(eventId);
        //     return events;
        //   },
        // }),
      ];
      // if (process.env.SERPAPI_API_KEY) {
      //   tools.push(new SerpAPI());
      // }

      const chat = new ChatOpenAI({
        modelName: "gpt-3.5-turbo-0613",
        temperature: 0,
      });

      const { messages, input } = req.body;

      const pastMessages = messages.map(
        (message: { role: string; content: string }) => {
          return message.role === "human"
            ? new HumanMessage({ content: message.content })
            : new AIMessage({ content: message.content });
        }
      );

      const memory = new BufferMemory({
        chatHistory: new ChatMessageHistory(pastMessages),
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "output",
      });

      const agentExecutor = await initializeAgentExecutorWithOptions(
        tools,
        chat,
        {
          agentType: "openai-functions",
          verbose: false,
          maxIterations: 10,
          memory,
        }
      );

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
