"use client";
import AiChatTextArea from "@/components/AiChatTextArea";
import DataWidget from "@/components/widgets/DataWidget";
import FinancesWidget from "@/components/widgets/FinancesWidget";
import ProfileWidget from "@/components/widgets/ProfileWidget";
import { useRouter } from "next/navigation";
import CreatePost from "./CreatePost";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col w-full items-center gap-4 pt-8 pb-8 pl-4 pr-4 overflow-y-auto lg:grid grid-cols-[0.8fr,1.3fr,0.8fr] lg:items-start  lg:pt-0 lg:pb-20 lg:pr-12 lg:pl-12 bg-[#f7f7f7] dark:bg-[#080808]">
      <div className="w-full lg:col-span-1 flex flex-col gap-4 h-full pt-[90px]">
        <ProfileWidget />
        <FinancesWidget />
      </div>

      <div className="w-full lg:col-span-1 flex flex-1 flex-col gap-4 h-full overflow-y-auto">
        <div className="pt-[90px]">
          <CreatePost />
        </div>

        {/* <div
          className="flex items-center relative"
          onClick={() => router.push("/agent")}
        >
          <AiChatTextArea input={""} setInput={null} disabled={false} />
        </div> */}
      </div>

      <div className=" lg:col-span-1 flex flex-col gap-4 h-full pt-[90px]">
        <DataWidget />
      </div>
    </div>
  );
}
