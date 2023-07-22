"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useWeb5 from "@/hooks/useWeb5";
import { secondsToHMS } from "@/lib/utils";
import {
  photosAtom,
  selectedPhotosAtom,
  selectingPhotosAtom,
} from "@/state/storage/photosAtom";
import {
  selectedVideosAtom,
  selectingVideosAtom,
  videosAtom,
} from "@/state/storage/videosAtom";
import ImageObject from "@/types/ImageObject";
import VideoObject from "@/types/VideoObject";
import Compressor from "compressorjs";
import { useAtom } from "jotai";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

// Define a global cache object
export let imageCache: { [recordId: string]: Blob } = {};

export default function GridItem(props: {
  index: number;
  item: ImageObject | VideoObject;
  type: "image" | "video";
}) {
  const router = useRouter();
  const [image, setImage] = useState<Blob | null>(null);
  const [loadComplete, setLoadingComplete] = useState(false);
  const [selectingPhotos] = useAtom(selectingPhotosAtom);
  const [selectedPhotos, setSelectingPhotos] = useAtom(selectedPhotosAtom);
  const [name, setName] = useState(props.item.name);
  const [photos, setPhotos] = useAtom(photosAtom);
  const [selectingVideos] = useAtom(selectingVideosAtom);
  const [selectedVideos, setSelectedVideos] = useAtom(selectedVideosAtom);
  const [, setVideos] = useAtom(videosAtom);

  const { web5 } = useWeb5();

  async function fetchImage() {
    // If image is already in the cache use that
    let recordId = "";
    if (props.type === "image") {
      recordId = (props.item as ImageObject).contentUrl;
    } else if (props.type === "video") {
      recordId = (props.item as VideoObject).thumbnailUrl!;
    }
    if (imageCache[recordId]) {
      setImage(imageCache[recordId]);
      return;
    }

    // If image is not in image cache we need to fetch the blob
    if (web5) {
      const blobResult = await web5.dwn.records.query({
        message: {
          filter: {
            recordId: recordId,
          },
        },
      });

      if (blobResult.records) {
        const blob = await blobResult.records[0].data.blob();

        // Compress Image
        new Compressor(blob, {
          quality: 0.4,
          height: isMobile ? 150 : undefined,
          width: isMobile ? 150 : undefined,
          success(file) {
            setImage(file);
            // Save to global cache
            // if (!isMobile)
            imageCache[recordId] = file;
          },
        });

        // setImage(blob);
        // Save the fetched blob into the cache
        // imageCache[props.recordId] = blob;
      }
    }
  }

  async function updateItemName(newName: string) {
    if (web5) {
      try {
        if (props.type === "image") {
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
              photo.identifier === props.item.identifier
                ? { ...photo, name: newName }
                : photo
            )
          );

          // Fetch file to be updated
          const photoRes = await web5.dwn.records.query({
            message: {
              filter: {
                recordId: props.item.identifier,
              },
            },
          });

          if (photoRes.records) {
            let photo = photoRes.records[0];
            let photoData: ImageObject = await photo.data.json();
            photoData.name = newName;

            await photo.update({
              data: photoData,
            });
          }
        } else if (props.type === "video") {
          setVideos((prevVideos) =>
            prevVideos.map((video) =>
              video.identifier === props.item.identifier
                ? { ...video, name: newName }
                : video
            )
          );

          const videoRes = await web5.dwn.records.query({
            message: {
              filter: {
                recordId: (props.item as VideoObject).recordId,
              },
            },
          });

          if (videoRes.records) {
            let video = videoRes.records[0];
            let videoData: VideoObject = await video.data.json();
            videoData.name = newName;

            await video.update({
              data: videoData,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    fetchImage();
  }, [web5]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-2 gap-2 rounded hover:cursor-pointer ${
        !selectingPhotos &&
        !selectingVideos &&
        "hover:bg-gray-100 hover:dark:bg-[#1d1d1d]"
      }`}
      onClick={() => {
        if (props.type === "image") {
          if (!selectingPhotos) {
            router.push(`/photo/${props.index}`);
          } else {
            if (!selectedPhotos.includes(props.item as ImageObject)) {
              setSelectingPhotos((prevSelected: ImageObject[]) => [
                props.item as ImageObject,
                ...prevSelected,
              ]);
            } else {
              setSelectingPhotos((prevSelected: ImageObject[]) =>
                prevSelected.filter(
                  (photo) =>
                    photo.contentUrl !== (props.item as ImageObject).contentUrl
                )
              );
            }
          }
        } else if (props.type === "video") {
          if (!selectingVideos) {
            router.push(`/video/${(props.item as VideoObject).url}`);
          } else {
            if (!selectedVideos.includes(props.item as VideoObject)) {
              setSelectedVideos((prevSelected: VideoObject[]) => [
                props.item as VideoObject,
                ...prevSelected,
              ]);
            } else {
              setSelectedVideos((prevSelected: VideoObject[]) =>
                prevSelected.filter(
                  (video) => video.url !== (props.item as VideoObject).url
                )
              );
            }
          }
        }
      }}
    >
      <div
        className={`h-[70px] w-[70px] md:w-[105px] md:h-[105px] relative rounded overflow-hidden `}
      >
        {!loadComplete && (
          <Skeleton className="h-[70px] w-[70px] md:w-[105px] md:h-[105px]" />
        )}
        {image && (
          <>
            {props.type === "video" && (props.item as VideoObject).duration && (
              <div className="absolute z-30 bottom-0 right-1">
                <small className="text-sm font-medium leading-none">
                  {secondsToHMS((props.item as VideoObject).duration!)}
                </small>
              </div>
            )}
            <Image
              src={URL.createObjectURL(image)}
              alt="img"
              fill
              style={{ objectFit: "cover" }}
              quality={20}
              loading="lazy"
              onLoadingComplete={() => {
                setLoadingComplete(true);
              }}
              className={`${
                (selectedPhotos.includes(props.item as ImageObject) ||
                  selectedVideos.includes(props.item as VideoObject)) &&
                "opacity-30"
              }`}
            />
          </>
        )}
      </div>
      {(selectedPhotos.includes(props.item as ImageObject) ||
        selectedVideos.includes(props.item as VideoObject)) && (
        <Check className="absolute z-30 bottom-8 right-4 bg-blue-500 rounded-full h-4 w-4 p-1 text-white" />
      )}
      {!selectingPhotos && !selectingVideos ? (
        <small className="text-xs text-center font-medium leading-none truncate w-full ">
          {name}
        </small>
      ) : (
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="border-none p-1 text-xs h-min"
          onBlur={async () => {
            await updateItemName(name);
          }}
        />
      )}
    </div>
  );
}
