"use client";
import { photosAtom, selectedPhotosAtom } from "@/state/storage/photosAtom";
import { useAtom } from "jotai";
import useWeb5 from "./useWeb5";
import { useEffect } from "react";
import { DateSort } from "@tbd54566975/dwn-sdk-js";
import ImageObject from "@/types/ImageObject";
import { loadingAtom } from "@/state/loadingAtom";
import { isMobile } from "react-device-detect";

export default function usePhotos() {
  const [photos, setPhotos] = useAtom(photosAtom);
  const { web5, did } = useWeb5();
  const [selectedPhotos, setSelectedPhotos] = useAtom(selectedPhotosAtom);
  const [, setLoading] = useAtom(loadingAtom);

  async function fetchImages() {
    if (web5) {
      const imagesRes = await web5.dwn.records.query({
        message: {
          filter: {
            schema: "https://schema.org/ImageObject",
          },
          dateSort: DateSort.CreatedDescending,
        },
      });

      const _images: ImageObject[] = [];
      if (imagesRes.records)
        for (var record of imagesRes.records) {
          let imageObj: ImageObject = await record.data.json();
          imageObj.identifier = record.id;

          // Fetch image Blob
          // const imageBlobRes = await web5.dwn.records.query({
          //   message: {
          //     filter: {
          //       recordId: imageObj.contentUrl,
          //     },
          //   },
          // });

          // if (imageBlobRes.records && imageBlobRes.records?.length > 0) {
          //   const imgUrl = await imageBlobRes.records[0].data.blob();
          //   imageObj.contentUrl = URL.createObjectURL(imgUrl);
          // }
          _images.push(imageObj);
        }

      setPhotos(_images);
    }
  }

  async function deleteSelectedPhotos() {
    setLoading(true);
    for (var i = 0; i < selectedPhotos.length; i++) {
      if (selectedPhotos[i].identifier) {
      }
      await web5?.dwn.records.delete({
        message: {
          recordId: selectedPhotos[i].identifier!,
        },
      });
    }

    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => !selectedPhotos.includes(photo))
    );
    setSelectedPhotos([]);
    setLoading(false);
  }

  async function uploadPhotos(files: FileList) {
    if (web5) {
      setLoading(true);
      for (var i = 0; i < files.length; i++) {
        // Upload image to blob store
        const blobResult = await web5.dwn.records.create({
          data: files[i],
          message: {
            dataFormat: files[i].type,
          },
        });

        const data: ImageObject = {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          author: did!,
          name: files[i].name,
          encodingFormat: files[i].type,
          uploadDate: new Date().toISOString(),
          contentUrl: blobResult.record!.id, // TODO: Change this to https url of image instead of record id
        };

        // Upload as Image Object: https://schema.org/ImageObject
        const imageObjRes = await web5.dwn.records.create({
          data: data,
          message: {
            schema: "https://schema.org/ImageObject",
          },
        });

        // Update Photos array in local storage
        setPhotos((prevPhotos: ImageObject[]) => [data, ...prevPhotos]);
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, [web5]);

  return { photos, deleteSelectedPhotos, uploadPhotos };
}
