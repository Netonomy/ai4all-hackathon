import { atom } from "jotai";

interface HumanMessage {
  type: "human";
  message: string;
}

export interface AiAction {
  type: "aiAction";
  tool: string;
  toolInput: string;
  inProgress: boolean;
  toolResponse?: string;
}

interface AiMessage {
  type: "ai";
  message: string;
}

type Message = HumanMessage | AiAction | AiMessage;

export const messagesAtom = atom<Message[]>([]);
