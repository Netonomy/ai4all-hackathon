"use client";
import AvatarProfile from "@/components/AvatarProfile";
import BackBtn from "@/components/BackBtn";
import KeyLogo from "@/components/KeyLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tokenAtom } from "@/state/tokenAtom";
import { useAtom } from "jotai";
import router from "next/router";

export default function Header({ showBackBtn }: { showBackBtn?: boolean }) {
  const [, setToken] = useAtom(tokenAtom);

  return (
    <div className="absolute top-0 left-0 right-0 h-[80px] z-[100] backdrop-blur-xl bg-white/30 border-b-[1.5px] dark:bg-black/30">
      <div className="h-full w-full flex items-center p-6">
        <div className="w-[20%]">{showBackBtn && <BackBtn />}</div>

        <div className="flex items-center justify-center gap-2 w-[60%]">
          <KeyLogo height={45} width={45} />
          {/* <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Netonomy
            </h3> */}
        </div>

        <div className="flex items-center gap-2 w-[20%] justify-end">
          {/* {messages.length > 0 && (
              <Badge onClick={() => setMessages([])} className="cursor-pointer">
                Reset Chat
              </Badge>
            )} */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-[40px] w-[40px]">
                <AvatarProfile />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[110]">
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                onClick={() => {
                  setToken(null);
                  router.push("/welcome");
                }}
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
