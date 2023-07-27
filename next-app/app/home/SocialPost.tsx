import AvatarProfile from "@/components/AvatarProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
            className="max-w-md max-h-md"
            key={idx}
            src={word}
            alt="content"
          />
        );
      }
      if (/^nostr:npub/.test(word)) {
        return (
          <NostrLink key={idx} pubKey={nip19.decode(word.split("nostr:")[1])} />
        );
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

  const numReactions = useEventReactions(event);

  return (
    <Card className="p-5 mb-4 rounded-xl">
      <CardHeader>
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
      </CardHeader>

      <CardContent className="w-full relative flex flex-col">
        <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
          {renderContent(event.content)}
        </p>

        <div className="mt-6">
          {numReactions ? (
            <div className="flex items-center gap-1">
              <div className="cursor-pointer">
                <HeartIcon />
              </div>

              <small className="text-sm font-medium leading-none">
                {numReactions}
              </small>
            </div>
          ) : (
            <Skeleton className="w-12 h-6" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
