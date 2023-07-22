"use client";
import AiChatTextArea from "@/components/AiChatTextArea";
import { Button } from "@/components/ui/button";
import CredentialsWidget from "@/components/widgets/CredentialsWidget";
import DataWidget from "@/components/widgets/DataWidget";
import FinancesWidget from "@/components/widgets/FinancesWidget";
import MessagesWidget from "@/components/widgets/MessagesWidget";
import ProfileWidget from "@/components/widgets/ProfileWidget";
import { SendIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  // const [aiChatText, setAiChatText] = useState("");

  return (
    <div className="flex flex-1 flex-col w-full items-center gap-4 pt-8 pb-8 pl-4 pr-4 overflow-y-auto lg:grid grid-cols-[1fr,1.2fr,1fr] lg:items-start  lg:pt-20 lg:pb-20 lg:pr-12 lg:pl-12">
      <div className="w-full lg:col-span-1 flex flex-col gap-4 h-full">
        <ProfileWidget />
        <FinancesWidget />
      </div>

      <div className="w-full lg:col-span-1 flex flex-col gap-4 h-full">
        <div
          className="flex items-center relative"
          onClick={() => router.push("/agent")}
        >
          <AiChatTextArea input={""} setInput={null} disabled={false} />
        </div>

        {/* <Input
      placeholder="Chat with your digital agent..."
      className="w-full min-h-[47px] rounded-xl"
      
    /> */}
        <DataWidget />
      </div>

      {/* <div className="w-full lg:col-span-1 flex flex-col gap-4 h-full">
        <MessagesWidget />
      </div> */}
    </div>
  );
}
