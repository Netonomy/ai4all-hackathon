"use client";
import useProfile from "@/hooks/useProfile";
import AvatarProfile from "../AvatarProfile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useAtom } from "jotai";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { getPublicKey, nip19 } from "nostr-tools";
import { CheckCircle, CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Image from "next/image";

export default function ProfileWidget() {
  const { profile } = useProfile();

  const [copied, setCopied] = useState(false);

  function copyPubKeyToClipboard() {
    if (profile?.npub) {
      navigator.clipboard.writeText(profile?.npub).then(() => {
        setCopied(true);

        setTimeout(() => setCopied(false), 3000);
      });
    }
  }

  return (
    <Card className="min-h-[150px] rounded-2xl w-[90%] max-w-[335px] mt-[90px]">
      <CardContent className="h-full flex items-center justify-center gap-2 lg:gap-2 lg:flex-col">
        <div className="w-full relative mb-10 mt-2">
          <div className="w-full h-28">
            {profile?.banner && (
              <Image
                src={profile.banner}
                alt="banner"
                fill
                className="rounded-3xl"
              />
            )}
          </div>

          <div className="h-12 w-12 lg:h-20 lg:w-20 absolute bottom-[-30%] left-1/2 transform -translate-x-1/2">
            <AvatarProfile />
          </div>
        </div>

        {!profile ? (
          <Skeleton className="h-8 w-[250px]" />
        ) : (
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {profile.name}
          </h4>
        )}

        {profile?.npub ? (
          <div className="flex items-center gap-2">
            🔑
            <p className="text-sm text-muted-foreground max-w-[250px] truncate">
              {profile.npub}
            </p>
            {copied ? (
              <CheckCircle className="h-4 w-4 cursor-pointer text-green-600" />
            ) : (
              <CopyIcon
                className="h-4 w-4 cursor-pointer"
                onClick={copyPubKeyToClipboard}
              />
            )}
          </div>
        ) : (
          <Skeleton className="h-6 w-[150px]" />
        )}

        <div className="w-[80%] flex items-center justify-around mt-6">
          <div className="flex flex-col items-center">
            <div className="text-lg font-semibold">250</div>
            <p className="text-sm text-muted-foreground">Post</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-lg font-semibold">100</div>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-lg font-semibold">210</div>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>

        <Button className="rounded-xl w-[80%] mt-6 mb-2">My Profile</Button>
      </CardContent>
    </Card>
  );
}
