"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useProfile from "@/hooks/useProfile";

export default function AvatarProfile() {
  const { profile, profileImg } = useProfile();

  return (
    <Avatar className="h-full w-full">
      {profileImg && <AvatarImage src={URL.createObjectURL(profileImg)} />}
      <AvatarFallback>
        <Skeleton className="h-full w-full rounded-full" />
      </AvatarFallback>
    </Avatar>
  );
}
