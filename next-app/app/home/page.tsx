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
    <div className="flex flex-1 w-full flex-row items-center mb-4">
      <div className="w-0 h-0 hidden flex-col items-center  lg:flex lg:h-full  lg:w-[30%] gap-6">
        <ProfileWidget />
        <FinancesWidget />
      </div>

      <div className="w-full h-full flex flex-col items-center lg:w-[60%] xl:w-[40%] overflow-y-auto max-h-screen">
        <div className="mt-[90px] w-full">
          <CreatePost />
        </div>

        <div className=" flex items-center gap-2 mb-4 w-full">
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

      <div className="w-0 h-0 hidden flex-col items-center  lg:flex lg:h-full  lg:w-[30%] gap-6">
        {/* <ProfileSearch /> */}

        <DataWidget />
      </div>
    </div>
  );
}
