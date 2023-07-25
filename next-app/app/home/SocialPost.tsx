import AvatarProfile from "@/components/AvatarProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useNostrProfile from "@/hooks/nostr/useNostrProfile";
import Image from "next/image";
import { Event } from "nostr-tools";

export default function SocialPost({ event }: { event: Event<1> }) {
  const profile = useNostrProfile(event.pubkey);
  const content = profile ? JSON.parse(profile.content) : null;

  return (
    <Card className="p-4 mb-2">
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

          <small className="text-sm font-medium leading-none">
            {content && content.name}
          </small>
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
