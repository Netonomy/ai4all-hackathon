"use client";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AgentChatBtn() {
  const router = useRouter();
  return (
    <Button
      className="rounded-full absolute bottom-2 right-2 h-[55px] w-[55px] p-2 dark:bg-[#1d1d1d] "
      onClick={() => router.push("/agent")}
    >
      <div className="text-3xl">🤖</div>
    </Button>
  );
}
