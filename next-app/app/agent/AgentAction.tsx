import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AiAction } from "./page";
import { Loader, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function AgentAction({ action }: { action: AiAction }) {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  switch (action.tool) {
    case "search" || "web-browser": {
      return (
        <Accordion
          type="single"
          collapsible
          className="rounded-xl bg-slate-900"
        >
          <AccordionItem value="item-1" className="border-b-0 ">
            <AccordionTrigger className="p-2 hover:no-underline">
              {action.inProgress ? (
                <div className="mr-1 flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching the web
                </div>
              ) : (
                <div className="mr-1 flex items-center">Finished Search</div>
              )}
            </AccordionTrigger>
            <AccordionContent className="pl-2 pr-2 ml-6 mr-2">
              <div className="flex items-center gap-2">
                <div className="font-semibold">Search Input:</div>
                {action.toolInput}
              </div>

              {action.toolResponse && (
                <div className="mt-4 flex items-start gap-2 h-auto justify-start">
                  <div className="font-semibold flex flex-1 w-18">Results:</div>
                  {action.toolResponse}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }
    case "bitcoin-address-generator": {
      return (
        <>
          {action.inProgress ? (
            <div className="h-11 flex items-center bg-black rounded-lg p-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating new bitcoin address
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div
                className="cursor-pointer p-2 rounded-xl hover:ring-2 ring-black relative overflow-hidden ease-in"
                onClick={() => {
                  if (action.toolResponse)
                    navigator.clipboard
                      .writeText(action.toolResponse)
                      .then(() => {
                        setShowCopiedMessage(true);

                        setTimeout(() => {
                          setShowCopiedMessage(false);
                        }, 1000);
                      });
                }}
              >
                <QRCode value={action.toolResponse!} height={250} />

                {showCopiedMessage && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-white/30 flex items-center justify-center ">
                    <Badge>Coped!</Badge>
                  </div>
                )}
              </div>

              <small className="text-sm font-medium leading-none text-black">
                Click the QR code to copy address
              </small>
            </div>
          )}
        </>
      );
    }
    default: {
      return <></>;
    }
  }
}
