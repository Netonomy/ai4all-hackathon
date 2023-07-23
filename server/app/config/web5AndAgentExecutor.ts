import { Web5 } from "@tbd54566975/web5";
import { DwnApi } from "@tbd54566975/web5/dist/types/dwn-api";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DynamicTool, SerpAPI, ChainTool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { createChainAddress } from "lightning";
import { lnd } from "./lndClient.js";
import { HumanMessage, AIMessage } from "langchain/schema";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/dist/document.js";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { WebBrowser } from "langchain/tools/webbrowser";

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

  // let docs: Document<Record<string, any>>[] = [];

  // if (filesRes.records) {
  //   for (const record of filesRes.records) {
  //     const file = await record.data.json();
  //     const blobRecordId = file.blobRecordId;

  //     const blobRes = await web5.dwn.records.read({
  //       message: {
  //         recordId: blobRecordId,
  //       },
  //     });

  //     if (blobRes.record) {
  //       const blob = await blobRes.record.data.blob();

  //       console.log(blob.type);

  //       let loader;
  //       if (blob.type === "application/pdf") {
  //         // loader = new PDFLoader(blob);
  //       } else if (blob.type === "text/plain") {
  //         // loader = new TextLoader(blob);
  //       } else if (
  //         blob.type ===
  //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //       ) {
  //         loader = new DocxLoader(blob);
  //       }
  //       if (loader) {
  //         const result = await loader.load();
  //         docs = docs.concat(result);
  //       }
  //     }
  //   }
  // }

  // Load the docs into the vector store
  // const vectorStore = await HNSWLib.fromDocuments(
  //   docs,
  //   new OpenAIEmbeddings({
  //     modelName: "text-embedding-ada-002",
  //   })
  // );
  // const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo-16k" });
  // const chain = VectorDBQAChain.fromLLM(model, vectorStore);
  // const qaTool = new ChainTool({
  //   name: "files-qa",
  //   description:
  //     "Ideal for querying and navigating through large volumes of documents using conversational interactions. Call this function when you need access to the users information in their documents.",
  //   chain: chain,
  // });

  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo-16k" });
  const embeddings = new OpenAIEmbeddings();

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
    new WebBrowser({ model, embeddings }),
  ];

  const chat = new ChatOpenAI({
    modelName: "gpt-4-0613",
    temperature: 0,
  });

  const prefix =
    "You are a personal AI Agent for a single user. Your goal is to help them as best you can and accomplish what they want you to. You have access to their personal information and bitcoin finances.";
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
