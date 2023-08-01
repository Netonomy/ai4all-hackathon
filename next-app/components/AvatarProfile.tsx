"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useProfile from "@/hooks/useProfile";

export default function AvatarProfile() {
  const { profile } = useProfile();
  
  return (
    <Avatar className="h-full w-full">
      {profile?.picture && <AvatarImage src={profile.picture} />}
      <AvatarFallback>
        <Skeleton className="h-full w-full rounded-full" />
      </AvatarFallback>
    </Avatar>
  );
}
