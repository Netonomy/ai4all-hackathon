import { Web5 } from "@tbd54566975/web5";
import { DwnApi } from "@tbd54566975/web5/dist/types/dwn-api";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DynamicTool, SerpAPI, ChainTool } from "langchain/tools";
import { createChainAddress } from "lightning";
import { lnd } from "./lndClient.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { DateSort } from "@tbd54566975/dwn-sdk-js";
import { VectorDBQAChain } from "langchain/chains";

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

  // const { records = [] } = await web5.dwn.records.query({
  //   message: {
  //     filter: {
  //       schema: "https://langchain.com/chatMessage",
  //     },
  //     dateSort: DateSort.CreatedAscending,
  //   },
  // });

  // const memoryDocs = await Promise.all(
  //   records.map(async (record) => {
  //     const serializedMessage = await record.data.json();
  //     const {
  //       kwargs: { content },
  //     } = serializedMessage;

  //     return new Document({
  //       pageContent: content,
  //       metadata: {
  //         role: serializedMessage.id.at(-1),
  //         dateCreated: record.dateCreated,
  //       },
  //     });
  //   })
  // );

  //   const embeddings = new OpenAIEmbeddings({
  //     modelName: "text-embedding-ada-002",
  //   });
  //   const model = new OpenAI({ modelName: "gpt-3.5-turbo" });
  //   const vectorStore = await MemoryVectorStore.fromDocuments(
  //     memoryDocs,
  //     embeddings
  //   );
  //   const memoryRetrievalChain = VectorDBQAChain.fromLLM(model, vectorStore);

  //   const tools = [
  //     new SerpAPI(),
  //     new DynamicTool({
  //       name: "bitcoin-address-generator",
  //       description:
  //         "call this function to generate a new on chain bitcoin address to recieve bitcoin. The input is a empty string.",
  //       func: async () => {
  //         const format = "p2wpkh";
  //         const address = (await createChainAddress({ lnd, format })).address;

  //         return address;
  //       },
  //     }),
  //     new ChainTool({
  //       name: "memory-qa",
  //       description:
  //         "This provides access to a vector database that has information from all previous messages between you and the user. You may need to be creative with your input to be able to find the info your looking for.",
  //       chain: memoryRetrievalChain,
  //     }),
  //     new DynamicTool({
  //       name: "current-date",
  //       description: "useful when you need to know the current date",
  //       func: async () => {
  //         return new Date().toLocaleDateString();
  //       },
  //     }),
  //   ];

  //   const chat = new ChatOpenAI({
  //     modelName: "gpt-4-0613",
  //     temperature: 0,
  //   });

  //   const prefix =
  //     "You are a personal AI Agent for a single user. Your goal is to help them as best you can and accomplish what they want you to. You have access to their personal information and bitcoin finances.";
  //   agentExecutor = await initializeAgentExecutorWithOptions(tools, chat, {
  //     agentType: "openai-functions",
  //     verbose: false,
  //     maxIterations: 10,
  //   });
}

// Invoke the initialization function
initResources().catch((err) => {
  console.error("Failed to initialize resources:", err);
});

export { dwn };
