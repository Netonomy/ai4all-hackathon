"use client";
import AiChatTextArea from "@/components/AiChatTextArea";
import PageContainer from "@/components/containers/PageContainer";
import { Bot, CheckCircle } from "lucide-react";
import { Fragment, useState } from "react";
import BackBtn from "@/components/BackBtn";
import { Button } from "@/components/ui/button";
import AgentAction from "./AgentAction";
import KeyLogo from "@/components/KeyLogo";
import { useAtom } from "jotai";
import { loadingAtom } from "@/state/loadingAtom";
import { Badge } from "@/components/ui/badge";
import AvatarProfile from "@/components/AvatarProfile";
import { tokenAtom } from "@/state/tokenAtom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Header from "@/app/Header";

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

function parseAuthenticateHeader(header) {
  return header.split(",").reduce((result, part) => {
    const [key, value] = part.split("=");
    result[key.trim()] = value.trim();
    return result;
  }, {});
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setLoading] = useAtom(loadingAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function sendMessage() {
    if (message === "") return;
    setLoading(true);
    let reader;
    const decoder = new TextDecoder("utf-8");

    let messageHistory = messages
      .filter((message) => message.type === "human" || message.type === "ai")
      .map((message) => {
        return message.type === "human"
          ? { role: "human", content: message.message }
          : { role: "ai", content: (message as AiMessage).message };
      });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "human",
        message,
      },
    ]);
    setMessage("");

    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: message,
          messages: messageHistory,
        }),
      }).then(async (response) => {
        if (response.status === 402) {
          const parsed = parseAuthenticateHeader(
            response.headers.get("www-authenticate")
          );

          try {
            const { preimage } = await (window as any).webln.sendPayment(
              parsed.invoice
            );

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ai/chat`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `L402 ${parsed["L402 macaroon"]}:${preimage}`,
              },
              body: JSON.stringify({
                input: message,
                messages: messageHistory,
              }),
            }).then((response) => {
              reader = response?.body?.getReader();
              reader.read().then(function processResult(result) {
                if (result.done) return;
                const data = decoder.decode(result.value, { stream: true });

                const parsedData = JSON.parse(data);

                if (parsedData.type === "agentEnd") {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      type: "ai",
                      message: parsedData.action.returnValues.output,
                    },
                  ]);

                  setLoading(false);
                } else if (parsedData.type === "agentAction") {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      type: "aiAction",
                      tool: parsedData.action.tool,
                      toolInput: parsedData.action.toolInput.input,
                      inProgress: true,
                    },
                  ]);
                } else if (parsedData.type === "toolEnd") {
                  setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    const lastMessage =
                      updatedMessages[updatedMessages.length - 1];

                    if (lastMessage && lastMessage.type === "aiAction") {
                      lastMessage.inProgress = false;
                      lastMessage.toolResponse = parsedData.output;
                    }

                    return updatedMessages;
                  });
                }

                // recursive call to keep reading the stream
                return reader.read().then(processResult);
              });
            });
          } catch (err) {
            console.log("didnt pay invoice");
            console.error(err);
          }
        }
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <Header
        showBackBtn
        rightSideComponents={
          messages.length > 0
            ? [
                <Badge
                  onClick={() => setMessages([])}
                  className="cursor-pointer"
                  key={"badge-reset"}
                >
                  Reset Chat
                </Badge>,
              ]
            : []
        }
      />

      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="relative flex flex-col items-center gap-4 w-[500px]">
          {messages.length === 0 && (
            <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight flex items-center gap-3 ">
              <CheckCircle height={30} width={30} className="text-green-600" />
              Ready to Chat
            </h3>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center w-full max-w-[1000px] relative overflow-y-auto">
        <div className="flex flex-1 flex-col items-center w-full max-w-[1000px] relative overflow-y-auto">
          <div className="h-[90%] w-full p-4 flex  overflow-y-auto flex-col-reverse">
            {messages
              .slice()
              .reverse()
              .map((message, i) => (
                <Fragment key={i}>
                  {message.type === "human" && (
                    <div className={` ml-auto flex gap-2 items-end`}>
                      <div className="whitespace-pre-wrap bg-blue-500 text-white rounded-xl inline-block my-2 p-3">
                        {message.message}
                      </div>

                      <div className="min-h-[35px] min-w-[35px] max-h-[35px] max-w-[35px] mb-3">
                        <AvatarProfile />
                      </div>
                    </div>
                  )}
                  {message.type === "ai" && (
                    <div className="mr-auto flex gap-2 items-end">
                      <div className="min-h-[35px] min-w-[35px] max-h-[35px] max-w-[35px] mb-3">
                        <Bot />
                      </div>

                      <div
                        className={`my-2 p-3 rounded-2xl inline-block bg-slate-400 text-white mr-auto whitespace-pre-wrap`}
                      >
                        {message.message}
                      </div>
                    </div>
                  )}
                  {message.type === "aiAction" && (
                    <div className="mr-auto flex gap-2 items-end">
                      <div className="min-h-[35px] min-w-[35px] max-h-[35px] max-w-[35px] mb-3" />
                      <div className={`my-2 inline-block text-white mr-auto`}>
                        <AgentAction action={message} />
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
          </div>
        </div>

        <div className="absolute bottom-2 w-full p-2 lg:bottom-6">
          <AiChatTextArea
            input={message}
            setInput={setMessage}
            disabled={false}
            onSend={() => {
              sendMessage();
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
}
