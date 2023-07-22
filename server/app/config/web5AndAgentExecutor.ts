import { Web5 } from "@tbd54566975/web5";
import { DwnApi } from "@tbd54566975/web5/dist/types/dwn-api";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DynamicTool, SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { createChainAddress } from "lightning";
import { lnd } from "./lndClient.js";
import { HumanMessage, AIMessage } from "langchain/schema";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

// global scope (outside of the route)
let dwn: DwnApi;
let agentExecutor: AgentExecutor;

// Initialize these resources when your server starts
async function initResources() {
  const { web5 } = await Web5.connect({
    techPreview: {
      dwnEndpoints: [],
    },
  });
  dwn = web5.dwn;

  const { records = [] } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: "https://langchain.com/chatMessage",
      },
    },
  });

  const pastMessages = await Promise.all(
    records.map(async (record) => {
      const serializedMessage = await record.data.json();
      const {
        kwargs: { content },
      } = serializedMessage;

      return serializedMessage.id.includes("HumanMessage")
        ? new HumanMessage({ content })
        : new AIMessage({ content });
    })
  );

  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
    returnMessages: true,
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "output",
  });

  const tools = [
    new Calculator(),
    new SerpAPI(),
    new DynamicTool({
      name: "bitcoin-address-generator",
      description:
        "call this function to generate a new on chain bitcoin address to recieve funds. The input is a empty string.",
      func: async () => {
        const format = "p2wpkh";
        const address = (await createChainAddress({ lnd, format })).address;

        return address;
      },
    }),
  ];
  const chat = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
  });

  agentExecutor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: "openai-functions",
    verbose: false,
    maxIterations: 10,
    memory,
  });
}

// Invoke the initialization function
initResources().catch((err) => {
  console.error("Failed to initialize resources:", err);
});

export { dwn, agentExecutor };
