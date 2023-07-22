"use client";
import MyRingLoader from "@/components/MyRingLoader";
import { Button } from "@/components/ui/button";
import useWeb5 from "@/hooks/useWeb5";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer({
  params,
}: {
  params: { recordId: string };
}) {
  const router = useRouter();
  const { web5 } = useWeb5();
  const [video, setVideo] = useState<Blob | null>(null);

  async function fetchVideo() {
    if (web5) {
      //   If video is already in the cache use that
      //   if (videoCache[params.recordId]) {
      //     setVideo(videoCache[params.recordId]);
      //     return;
      //   }

      // Fetch thumbnail
      const videoRes = await web5.dwn.records.read({
        message: {
          recordId: params.recordId,
        },
      });

      if (videoRes.record) {
        const blob = await videoRes.record.data.blob();

        setVideo(blob);

        // videoCache[params.recordId] = blob;
      }
    }
  }

  useEffect(() => {
    fetchVideo();
  }, [web5]);

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center dark:bg-black relative">
      <Button
        className="absolute top-0 right-0 m-4 w-10 rounded-full p-0 z-30"
        onClick={() => {
          router.back();
        }}
      >
        <X />
      </Button>

      {video ? (
        <ReactPlayer
          url={URL.createObjectURL(video)}
          height={"100%"}
          width={"100%"}
          controls
        />
      ) : (
        <MyRingLoader />
      )}
    </div>
  );
}
