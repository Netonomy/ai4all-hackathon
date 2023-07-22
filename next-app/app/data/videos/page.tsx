"use client";
import { Card, CardContent } from "@/components/ui/card";
import useVideos from "@/hooks/useVideos";
import { useAtom } from "jotai";
import {
  selectedVideosAtom,
  selectingVideosAtom,
} from "@/state/storage/videosAtom";
import GridContainer, {
  GridItemProps,
} from "@/components/containers/GridContainer";
import VideoObject from "@/types/VideoObject";
import GridItem from "../../../components/GridItem";
import DataTopBar from "@/components/DataTopBar";
import { useState } from "react";

export default function Videos() {
  const { UploadVideos, deleteSelectedVideos, videos } = useVideos();
  const [selectingVideos, setSelectingVideos] = useAtom(selectingVideosAtom);
  const [searchText, setSearchText] = useState("");
  const [, setSelectedVideos] = useAtom(selectedVideosAtom);

  const filteredVideos = videos.filter((video) =>
    video.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
  );

  return (
    <div className="w-full h-full flex  flex-col items-center">
      <DataTopBar
        searchText={searchText}
        setSearchText={setSearchText}
        uploadBtnAccept="video/*"
        onFilesSelected={async (files: FileList) => {
          if (files) await UploadVideos(files);
        }}
        showSelectBtn
        deleteBtnClicked={() => {
          deleteSelectedVideos();
        }}
        selecting={selectingVideos}
        setSelecting={setSelectingVideos}
        setSelectedItems={setSelectedVideos}
      />

      <Card className="flex flex-1 mt-4 mb-2  shadow-md rounded-lg w-[90%] lg:w-full ">
        <CardContent className="flex flex-1 flex-col items-center w-full max-h-[calc(100vh-250px)] overflow-y-auto overflow-x-visible">
          <GridContainer
            items={filteredVideos}
            Component={(props: GridItemProps<VideoObject>) => (
              <GridItem index={props.index} item={props.item} type="video" />
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
