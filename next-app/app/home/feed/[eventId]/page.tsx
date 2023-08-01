import SocialFeed from "../../SocialFeed";

export default function FeedPage({ params }: { params: { eventId: string } }) {
  return <SocialFeed eventId={params.eventId} />;
}
