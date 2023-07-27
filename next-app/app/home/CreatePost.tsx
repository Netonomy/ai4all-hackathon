"use client";
import AvatarProfile from "@/components/AvatarProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  return (
    <Card className="rounded-2xl mb-8">
      <CardContent className="flex flex-col items-center">
        <div className="flex w-full ">
          <div className="w-10 h-10 min-w-[40px] min-h-[40px] mt-2">
            <AvatarProfile />
          </div>

          <Textarea
            placeholder="Share something..."
            className="shadow-none ml-2 min-h-[55px] h-auto max-h-[200px] bg-gray-100 dark:bg-[#1d1d1d] rounded-3xl text-black"
          />
        </div>
      </CardContent>
    </Card>
  );
}
