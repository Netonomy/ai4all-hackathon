import { loadingAtom } from "@/state/loadingAtom";
import { useAtom } from "jotai";
import useWeb5 from "./useWeb5";
import VideoObject from "@/types/VideoObject";
import { DateSort } from "@tbd54566975/dwn-sdk-js";
import { selectedVideosAtom, videosAtom } from "@/state/storage/videosAtom";
import { useEffect } from "react";

export default function useVideos() {
  const { web5 } = useWeb5();
  const [, setLoading] = useAtom(loadingAtom);
  const [videos, setVideos] = useAtom(videosAtom);
  const [selectedVideos, setSelectedVideos] = useAtom(selectedVideosAtom);

  // Function that takes in a video file
  // Loads to the first second
  // Create a thumbnail blob
  async function CreateVideoThumbnail(
    file: Blob
  ): Promise<{ blob: Blob; duration: number }> {
    return new Promise((resolve, reject) => {
      var url = URL.createObjectURL(file);

      // Create a video element
      var video = document.createElement("video");
      var duration = 0;

      // Once the metadata has been loaded, set the time
      video.onloadedmetadata = function () {
        // Set the video to 1 second mark
        video.currentTime = 1;
        // Get the video duration
        duration = video.duration;
      };

      // Once the video has seeked to the desired time, draw a thumbnail
      video.onseeked = function () {
        // Create a canvas and draw the video frame onto it
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var context = canvas.getContext("2d");
        context!.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a Blob
        canvas.toBlob(function (blob) {
          // Here, you have your thumbnail as a Blob
          if (blob) resolve({ blob, duration });
        }, "image/png");
      };

      // Set the video source
      video.src = url;
    });
  }

  async function UploadVideos(files: FileList) {
    if (web5) {
      setLoading(true);
      for (var i = 0; i < files.length; i++) {
        // Create a thumbnail for the file
        const { blob: thumbnail, duration } = await CreateVideoThumbnail(
          files[i]
        );

        // Upload thumbnail to blob store
        const thumbnailBlobResult = await web5.dwn.records.create({
          data: thumbnail,
          message: {
            dataFormat: thumbnail.type,
          },
        });

        // Upload thumbnail to blob store
        const videoBlobResult = await web5.dwn.records.create({
          data: files[0],
          message: {
            dataFormat: files[0].type,
          },
        });

        const data: VideoObject = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: files[i].name,
          encodingFormat: files[i].type,
          size: files[i].size.toString(),
          datePublished: new Date().toISOString(),
          identifier: videoBlobResult.record!.id,
          url: videoBlobResult.record!.id, // TODO: Change this to https url of file instead of record id
          thumbnailUrl: thumbnailBlobResult.record!.id,
          duration: duration,
        };

        // Upload as Video Object: https://schema.org/VideoObject
        const imageObjRes = await web5.dwn.records.create({
          data: data,
          message: {
            schema: "https://schema.org/VideoObject",
          },
        });

        // Update Videos array in local storage
        setVideos((prevVids: VideoObject[]) => [data, ...prevVids]);
      }

      setLoading(false);
    }
  }

  async function fetchVideos() {
    if (web5) {
      const videosRes = await web5.dwn.records.query({
        message: {
          filter: {
            schema: "https://schema.org/VideoObject",
          },
          dateSort: DateSort.CreatedDescending,
        },
      });

      const _videos: VideoObject[] = [];
      if (videosRes.records)
        for (var record of videosRes.records) {
          let videoObj: VideoObject = await record.data.json();
          videoObj.recordId = record.id;

          _videos.push(videoObj);
        }

      setVideos(_videos);
    }
  }

  async function deleteSelectedVideos() {
    setLoading(true);
    for (var i = 0; i < selectedVideos.length; i++) {
      if (selectedVideos[i].recordId) {
        await web5?.dwn.records.delete({
          message: {
            recordId: selectedVideos[i].recordId!,
          },
        });
      }
    }

    setVideos((prevVideos) =>
      prevVideos.filter((video) => !selectedVideos.includes(video))
    );
    setSelectedVideos([]);
    setLoading(false);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, UploadVideos, deleteSelectedVideos };
}
