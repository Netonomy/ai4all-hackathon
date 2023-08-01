import AvatarProfile from "@/components/AvatarProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useEventReactions from "@/hooks/nostr/useEventReactions";
import useNostrProfile from "@/hooks/nostr/useNostrProfile";
import { timeStampToTimeAgo } from "@/utils/timestampToTimeAgo";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { Event, nip19 } from "nostr-tools";
import { Fragment, useEffect, useState } from "react";

function NostrLink({ pubKey }) {
  const profile = useNostrProfile(pubKey.data);

  return (
    <a href={"https://google.com"} target="_blank" className="text-blue-500">
      @{profile ? JSON.parse(profile.content).name : ""}{" "}
    </a>
  );
}

function canDecode(str) {
  const allowedChars = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  return str.split("").every((char) => allowedChars.includes(char));
}

function renderContent(content) {
  const lines = content.split("\n");
  return lines.map((line, index) => {
    const words = line.split(" ");
    const newLine = words.map((word, idx) => {
      const isImageUrl = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(
        word
      );
      if (isImageUrl) {
        return (
          <img
            className="max-w-md max-h-md rounded-xl"
            key={idx}
            src={word}
            alt="content"
          />
        );
      }
      if (/^nostr:npub/.test(word)) {
        const decodedString = word.split("nostr:")[1];
        if (canDecode(decodedString)) {
          return <NostrLink key={idx} pubKey={nip19.decode(decodedString)} />;
        } else {
          return word + " ";
        }
      }
      return word + " ";
    });
    return (
      <Fragment key={index}>
        {newLine}
        <br />
      </Fragment>
    );
  });
}

export default function SocialPost({ event }: { event: Event<1 | 6 | 65003> }) {
  const profile = useNostrProfile(event.pubkey);
  const content = profile ? JSON.parse(profile.content) : null;

  // const numReactions = useEventReactions(event);

  return (
    <div className="p-3 w-full rounded-none shadow-none">
      <div>
        <div className="flex items-center gap-4">
          <Avatar>
            {content && content.picture && (
              <AvatarImage src={content.picture} />
            )}

            <AvatarFallback>
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>

          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {content && content.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {timeStampToTimeAgo(event.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full relative flex flex-col overflow-auto p-4 mt-2">
        <p className="leading-7 [&:not(:first-child)]:mt-6 break-words max-w-[335px] xl:max-w-full  overflow-y-hidden">
          {renderContent(event.content)}
        </p>

        <div className="mt-6">
          <div className="flex items-center gap-1">
            <div className="cursor-pointer">
              <HeartIcon />
            </div>

            <small className="text-sm font-medium leading-none">
              {(event as any).reactionCount}
            </small>
          </div>
        </div>
      </div>

      <div className=" flex items-center gap-2 w-full rounded-2xl mt-2">
        <div className="border-b border-gray-300 w-full dark:bg-[#1d1d1d] dark:text-white dark:border-[#1d1d1d]"></div>
      </div>
    </div>
  );
}
