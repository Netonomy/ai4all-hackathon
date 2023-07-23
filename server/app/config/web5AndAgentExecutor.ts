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
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/dist/document.js";

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

  // const filesRes = await web5.dwn.records.query({
  //   message: {
  //     filter: {
  //       schema: "https://schema.org/DigitalDocument",
  //     },
  //   },
  // });

  // console.log(filesRes);

  // if (filesRes.records) {
  // const blobs = await Promise.all(
  //   filesRes.records.map(async (record) => {
  //     const blob = await record.data.blob();
  //     return blob;
  //   })
  // );
  // let docs: Document<Record<string, any>>[] = [];
  // for (const blob of blobs) {
  //   const loader = new PDFLoader(blob);
  //   const result = await loader.load();
  //   docs = docs.concat(result);
  // }
  // // Load the docs into the vector store
  // const vectorStore = await MemoryVectorStore.fromDocuments(
  //   docs,
  //   new OpenAIEmbeddings()
  // );
  // }

  const tools = [
    new Calculator(),
    new SerpAPI(),
    new DynamicTool({
      name: "bitcoin-address-generator",
      description:
        "call this function to generate a new on chain bitcoin address to recieve bitcoin. The input is a empty string.",
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

  const prefix =
    "You are a Personal AI Agent. You live in an application called Netonomy. Its an open source application that makes every person their own server. You have access to tools like the users bitcoin wallet and searching the internet. Help the user as best you can.";
  agentExecutor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: "openai-functions",
    verbose: false,
    maxIterations: 10,
    memory,
    agentArgs: {
      prefix,
    },
  });
}

// Invoke the initialization function
initResources().catch((err) => {
  console.error("Failed to initialize resources:", err);
});

export { dwn, agentExecutor };
