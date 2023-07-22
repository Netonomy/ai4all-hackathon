"use client";
import { Card, CardContent } from "@/components/ui/card";
import FilesList from "./FilesList";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import useFiles from "@/hooks/useFiles";
import { useDropzone } from "react-dropzone";
import { arrayToFileList } from "@/lib/utils";
import useWeb5 from "@/hooks/useWeb5";
import DataTopBar from "@/components/DataTopBar";

export default function FilesPage() {
  const [searchText, setSearchText] = useState("");
  const { UploadFiles } = useFiles();
  const { web5 } = useWeb5();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // convert File[] to FileList
      const fileList = arrayToFileList(acceptedFiles);
      // do something with the files
      UploadFiles(fileList);
    },
    [web5]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div className="flex flex-1 w-full flex-col items-center ">
      <DataTopBar
        searchText={searchText}
        setSearchText={setSearchText}
        uploadBtnAccept="*"
        onFilesSelected={async (files: FileList) => {
          if (files) await UploadFiles(files);
        }}
      />

      <motion.div
        initial={isMobile ? {} : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          isMobile
            ? {}
            : {
                duration: 1,
                delay: 0.2,
                ease: [0, 0.71, 0.2, 1.01],
              }
        }
        className="flex flex-1 mt-4 mb-2 shadow-md rounded-lg w-[90%] lg:w-full "
      >
        <Card
          {...getRootProps()}
          className={`flex flex-1  shadow-md rounded-lg w-full ${
            isDragActive ? "bg-gray-100 dark:bg-[#1d1d1d]" : ""
          }`}
        >
          <input {...getInputProps()} />
          <CardContent className="flex flex-1 flex-col items-center w-full max-h-[calc(100vh-250px)] overflow-y-auto overflow-x-visible">
            <FilesList searchText={searchText} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
