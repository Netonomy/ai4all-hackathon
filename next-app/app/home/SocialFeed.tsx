"use client";
import useFeed from "@/hooks/nostr/useFeed";
import SocialPost from "./SocialPost";
import { Skeleton } from "@/components/ui/skeleton";

export default function SocialFeed() {
  const feed = useFeed();

  return (
    <>
      {feed ? (
        feed.map((event) => <SocialPost key={event.id} event={event} />)
      ) : (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton className="h-[300px] w-full mb-4 rounded-3xl" />
          ))}
        </>
      )}
    </>
  );
}
