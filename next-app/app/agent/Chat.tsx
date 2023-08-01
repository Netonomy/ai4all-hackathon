import { Bot, CheckCircle } from "lucide-react";
import { Fragment, useState } from "react";
import AgentAction from "./AgentAction";
import AiChatTextArea from "@/components/AiChatTextArea";
import { loadingAtom } from "@/state/loadingAtom";
import { useAtom } from "jotai";
import AvatarProfile from "@/components/AvatarProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { messagesAtom } from "@/state/messagesAtom";

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

export default function Chat() {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [message, setMessage] = useState("");
  const [, setLoading] = useAtom(loadingAtom);

  async function sendMessage(messageToSend: string) {
    if (messageToSend === "") return;
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
        message: messageToSend,
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
          input: messageToSend,
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
                input: messageToSend,
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
    <div className="flex flex-1 w-full relative z-60">
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="relative flex flex-col items-center gap-8 w-[500px]">
          {messages.length === 0 && (
            <>
              <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight flex items-center gap-3 ">
                🤖 Ready to chat
              </h3>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    sendMessage(
                      "Publish an event to nostr for a trending events feed, then get the job result."
                    );
                  }}
                >
                  🔥 Get Trending Nostr Events
                </Button>

                {/* <Button
                  onClick={() => {
                    sendMessage(
                      "Get the current weather forecast for virginia."
                    );
                  }}
                >
                  ☁️ Weather forecast in VA
                </Button> */}
              </div>
            </>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="flex flex-1 flex-col items-center w-full max-w-[1000px] relative overflow-y-auto z-50 ">
          <div className="flex flex-1 flex-col items-center w-full max-w-[1000px]  relative overflow-y-auto z-50">
            <div
              className="h-[100%] w-full p-4 flex  overflow-y-auto flex-col-reverse"
              style={{ maxHeight: "90vh" }}
            >
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
        </div>
      )}

      <div className="absolute bottom-0 w-full p-2 lg:bottom-0 z-50">
        <AiChatTextArea
          input={message}
          setInput={setMessage}
          disabled={false}
          onSend={() => {
            sendMessage(message);
          }}
        />
      </div>
    </div>
  );
}
