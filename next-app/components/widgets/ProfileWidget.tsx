"use client";
import useProfile from "@/hooks/useProfile";
import AvatarProfile from "../AvatarProfile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProfileWidget() {
  const { profile } = useProfile();
  return (
    <Card className="w-full min-h-[150px] rounded-3xl">
      <CardContent className="h-full flex items-center justify-center gap-2 lg:gap-2 lg:flex-col">
        <div className="h-12 w-12 lg:h-32 lg:w-32">
          <AvatarProfile />
        </div>

        {!profile ? (
          <Skeleton className="h-8 w-[250px]" />
        ) : (
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {profile.name}
          </h4>
        )}
      </CardContent>
    </Card>
  );
}
