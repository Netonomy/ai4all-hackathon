import AvatarProfile from "@/components/AvatarProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useNostrProfile from "@/hooks/nostr/useNostrProfile";
import { timeStampToTimeAgo } from "@/utils/timestampToTimeAgo";
import Image from "next/image";
import { Event } from "nostr-tools";

export default function SocialPost({ event }: { event: Event<1 | 6 | 65003> }) {
  const profile = useNostrProfile(event.pubkey);
  const content = profile ? JSON.parse(profile.content) : null;

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

      <CardContent className="w-full relative">
        <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
          {event.content}
        </p>
      </CardContent>
    </Card>
  );
}
