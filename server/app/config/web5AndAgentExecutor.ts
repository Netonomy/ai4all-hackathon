import { Web5 } from "@tbd54566975/web5";
import { DwnApi } from "@tbd54566975/web5/dist/types/dwn-api";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChainTool, DynamicTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { createChainAddress } from "lightning";
import { lnd } from "./lndClient.js";
import { HumanMessage, AIMessage } from "langchain/schema";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/dist/document.js";
import { BabyAGI } from "langchain/experimental/babyagi";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

// global scope (outside of the route)
let dwn: DwnApi;
let babyAGI: BabyAGI;

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

  // First, we create a custom agent which will serve as execution chain.
  const todoPrompt = PromptTemplate.fromTemplate(
    "You are a planner who is an expert at coming up with a todo list for a given objective. Come up with a todo list for this objective: {objective}"
  );
  const tools: Tool[] = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "San Francisco,California,United States",
      hl: "en",
      gl: "us",
    }),
    // new ChainTool({
    //   name: "TODO",
    //   chain: new LLMChain({
    //     llm: new OpenAI({ temperature: 0 }),
    //     prompt: todoPrompt,
    //   }),
    //   description:
    //     "useful for when you need to come up with todo lists. Input: an objective to create a todo list for. Output: a todo list for that objective. Please be very clear what the objective is!",
    // }),
  ];
  const agentExecutor = await initializeAgentExecutorWithOptions(
    tools,
    new OpenAI({ temperature: 0, modelName: "gpt-4-0613" }),
    {
      agentType: "zero-shot-react-description",
      agentArgs: {
        prefix: `You are an AI who performs one task based on the following objective: {objective}. Take into account these previously completed tasks: {context}.`,
        suffix: `Question: {task}
{agent_scratchpad}`,
        inputVariables: ["objective", "task", "context", "agent_scratchpad"],
      },
    }
  );

  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  babyAGI = BabyAGI.fromLLM({
    llm: new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" }),
    vectorstore: vectorStore,
    maxIterations: 3,
  });
}

// Invoke the initialization function
initResources().catch((err) => {
  console.error("Failed to initialize resources:", err);
});

export { dwn, babyAGI };
