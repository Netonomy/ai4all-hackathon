"use client";
import useFeed from "@/hooks/nostr/useFeed";
import SocialPost from "./SocialPost";

export default function SocialFeed() {
  const feed = useFeed();

  return (
    <div className="h-full w-full">
      {feed && feed.map((event) => <SocialPost key={event.id} event={event} />)}
    </div>
  );
}
