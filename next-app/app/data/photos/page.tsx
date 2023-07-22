"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useAtom } from "jotai";
import {
  selectedPhotosAtom,
  selectingPhotosAtom,
} from "@/state/storage/photosAtom";
import { useEffect, useState } from "react";
import usePhotos from "@/hooks/usePhotos";
import GridContainer, {
  GridItemProps,
} from "../../../components/containers/GridContainer";
import ImageObject from "@/types/ImageObject";
import GridItem from "../../../components/GridItem";
import DataTopBar from "@/components/DataTopBar";

export default function PhotosPage() {
  const [selecting, setSelecting] = useAtom(selectingPhotosAtom);
  const [, setSelectedPhotos] = useAtom(selectedPhotosAtom);
  const [searchText, setSearchText] = useState("");
  const { deleteSelectedPhotos, photos, uploadPhotos } = usePhotos();

  const filteredPhotos = photos.filter((photo) =>
    photo.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
  );

  useEffect(() => {
    return () => {
      setSelecting(false);
    };
  }, []);

  return (
    <div className="flex flex-1 w-full flex-col items-center ">
      <DataTopBar
        searchText={searchText}
        setSearchText={setSearchText}
        onFilesSelected={async (files: FileList) => {
          if (files) await uploadPhotos(files);
        }}
        uploadBtnAccept="image/*"
        showSelectBtn
        deleteBtnClicked={() => deleteSelectedPhotos()}
        selecting={selecting}
        setSelecting={setSelecting}
        setSelectedItems={setSelectedPhotos}
      />

      <Card className="flex flex-1 mt-4 mb-2  shadow-md rounded-lg w-[90%] lg:w-full ">
        <CardContent className="flex flex-1 flex-col items-center w-full max-h-[calc(100vh-250px)] overflow-y-auto overflow-x-visible">
          <GridContainer
            items={filteredPhotos}
            Component={(props: GridItemProps<ImageObject>) => (
              <GridItem index={props.index} item={props.item} type="image" />
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
