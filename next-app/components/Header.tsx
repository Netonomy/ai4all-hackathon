"use client";
import AvatarProfile from "@/components/AvatarProfile";
import BackBtn from "@/components/BackBtn";
import KeyLogo from "@/components/KeyLogo";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { messagesAtom } from "@/state/messagesAtom";
import { tokenAtom } from "@/state/tokenAtom";
import { isLoggedInAtom } from "@/state/user/isLoggedIn";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function Header({
  showBackBtn,
  rightSideComponents,
}: {
  showBackBtn?: boolean;
  rightSideComponents?: ReactNode[];
}) {
  const [, setToken] = useAtom(tokenAtom);
  const router = useRouter();
  const [messages, setMessages] = useAtom(messagesAtom);
  const [, setLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <div className="absolute top-0 left-0 right-0 h-[70px] z-[100] backdrop-blur-xl bg-white/30 border-b-[1.5px] dark:bg-black/30">
      <div className="h-full w-full flex items-center p-6">
        <div className="w-[20%]">{showBackBtn && <BackBtn />}</div>

        <div className="flex items-center justify-center gap-2 w-[60%]">
          <KeyLogo height={45} width={45} />
          {/* <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Netonomy
            </h3> */}
        </div>

        <div className="flex items-center gap-2 w-[20%] justify-end">
          {rightSideComponents}

          {messages.length > 0 && (
            <Badge onClick={() => setMessages([])} className="cursor-pointer">
              New Chat
            </Badge>
          )}

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
                  setLoggedIn(false);
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
