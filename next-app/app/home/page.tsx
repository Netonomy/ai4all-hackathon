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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTopBar from "@/components/DataTopBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chat from "../agent/Chat";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-1 w-full flex-row items-center mb-4">
      <div className="w-0 h-0 hidden flex-col items-center  lg:flex lg:h-full  lg:w-[30%] gap-6">
        <ProfileWidget />
        {/* <FinancesWidget /> */}
      </div>

      <div className="w-full h-full flex flex-col items-center lg:w-[40%] xl:w-[41%] overflow-y-auto">
        <Chat />

        {/* <div className="mt-[90px] w-[98%] md:w-full z-40">
          <DataTopBar
            placeholder="Share something..."
            searchText={""}
            setSearchText={null}
            uploadBtnAccept="*"
            onFilesSelected={async (files: FileList) => {}}
          />
        </div> */}

        {/* <div className="mt-[90px] w-[98%] md:w-full z-40 flex flex-col">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
            Data Vending Machines
          </h3>

          <Card className="w-[150px] h-[150px]">
            <CardContent className="w-full h-full flex items-center justify-center">
              <CardTitle>🔥 Trending</CardTitle>
            </CardContent>
          </Card>
        </div> */}

        {/* <div className="flex items-center gap-2 my-2 w-full">
          <div className="border-b border-gray-300 w-full dark:border-[#1d1d1d]"></div>

          <Select defaultValue="trending">
            <SelectTrigger className="w-[150px] border-none focus:ring-0 ring-0 bg-transparent focus:bg-transparent focus:ring-transparent">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">🔥 Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className={`flex flex-1 rounded-none md:rounded-xl w-full }`}>
          <CardContent className="flex flex-1 flex-col items-center w-full overflow-y-auto overflow-x-visible">
            <SocialFeed />
          </CardContent>
        </Card> */}
      </div>

      <div className="w-0 h-0 hidden flex-col items-center  lg:flex lg:h-full  lg:w-[30%] gap-6">
        {/* <ProfileSearch /> */}

        <DataWidget />
      </div>
    </div>
  );
}
