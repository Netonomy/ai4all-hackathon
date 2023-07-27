import AvatarProfile from "@/components/AvatarProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useEventReactions from "@/hooks/nostr/useEventReactions";
import useNostrProfile from "@/hooks/nostr/useNostrProfile";
import { timeStampToTimeAgo } from "@/utils/timestampToTimeAgo";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { Event } from "nostr-tools";

export default function SocialPost({ event }: { event: Event<1 | 6 | 65003> }) {
  const profile = useNostrProfile(event.pubkey);
  const content = profile ? JSON.parse(profile.content) : null;

  const numReactions = useEventReactions(event);

  // console.log(content);

  return (
    <Card className="p-5 mb-4 rounded-3xl">
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
          {event.content}
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
