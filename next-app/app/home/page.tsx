"use client";
import AiChatTextArea from "@/components/AiChatTextArea";
import DataWidget from "@/components/widgets/DataWidget";
import FinancesWidget from "@/components/widgets/FinancesWidget";
import ProfileWidget from "@/components/widgets/ProfileWidget";
import { useRouter } from "next/navigation";
import CreatePost from "./CreatePost";
import SocialFeed from "./SocialFeed";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProfileSearch from "./ProfileSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col w-full items-center gap-4 pt-8 pl-4 pr-4 overflow-y-auto lg:grid grid-cols-[0.6fr,1.6fr,0.6fr] lg:items-start  lg:pt-0  lg:pr-12 lg:pl-12 bg-[#f7f7f7] dark:bg-[#080808]">
      <div className="w-full lg:col-span-1 flex flex-col gap-4 h-full pt-[80px]">
        <ProfileWidget />
        <FinancesWidget />
      </div>

      <div className="w-full lg:col-span-1 flex flex-1 flex-col h-full overflow-y-auto overflow-x-hidden">
        <div className="mt-[80px]">
          <CreatePost />
        </div>

        <div className=" flex items-center gap-2 mb-4">
          <div className="border-b border-gray-300 my-4 w-full"></div>

          <Select defaultValue="trending">
            <SelectTrigger className="w-[150px] border-none focus:ring-0 ring-0 bg-transparent focus:bg-transparent focus:ring-transparent">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">🔥 Trending</SelectItem>
              <SelectItem value="following">💛 Following</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SocialFeed />

        {/* <div
          className="flex items-center relative"
          onClick={() => router.push("/agent")}
        >
          <AiChatTextArea input={""} setInput={null} disabled={false} />
        </div> */}
      </div>

      <div className=" lg:col-span-1 flex flex-col gap-4 h-full pt-[80px]">
        <ProfileSearch />

        <DataWidget />
      </div>
    </div>
  );
}
