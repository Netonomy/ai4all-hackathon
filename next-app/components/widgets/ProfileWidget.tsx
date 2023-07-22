"use client";
import useProfile from "@/hooks/useProfile";
import AvatarProfile from "../AvatarProfile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProfileWidget() {
  const { profile } = useProfile();
  return (
    <Card className="w-full min-h-[100px] lg:h-[314px]">
      <CardContent className="h-full flex items-center justify-center gap-2 lg:gap-1 lg:flex-col">
        <div className="h-12 w-12 lg:h-32 lg:w-32">
          <AvatarProfile />
        </div>

        {!profile ? (
          <Skeleton className="h-8 w-[250px]" />
        ) : (
          <div className="flex gap-2">
            <div className="font-light text-[31px]">Hello </div>
            <div className="font-semibold text-[31px]">
              {profile.name.split(" ")[0]}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
