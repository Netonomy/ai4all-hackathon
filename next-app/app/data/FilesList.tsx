import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { isMobile } from "react-device-detect";
import useFiles from "@/hooks/useFiles";
import ListItem from "@/components/ListItem";
import FileItemIcon from "./FileItemIcon";

export default function FilesList(props: { searchText: string }) {
  const { files, deleteFile, openFile, updateFileName } = useFiles();

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(props.searchText.toLowerCase())
  );

  return (
    <>
      {files ? (
        files.length > 0 ? (
          <AnimatePresence>
            <motion.div
              initial="initial"
              animate="animate"
              variants={
                isMobile
                  ? {}
                  : {
                      initial: { opacity: 0 },
                      animate: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1, duration: 0.3 },
                      },
                    }
              }
              className="w-full"
            >
              {filteredFiles.map((file) => (
                <ListItem
                  key={file.identifier}
                  title={file.name}
                  recordId={file.identifier}
                  subTitle={new Date(file.datePublished).toLocaleDateString()}
                  icon={<FileItemIcon type={file.encodingFormat} />}
                  onDelete={() => {
                    deleteFile(file.identifier);
                  }}
                  onClick={() => {
                    openFile(file.url);
                  }}
                  updateFilename={updateFileName}
                />
                // <FileListItem document={file} key={file.url} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="text-lg font-semibold">No Files Uploaded</div>
          </div>
        )
      ) : (
        <>
          {Array.from({ length: 22 }).map((_, i) => (
            <Skeleton className="min-h-[56px] w-[95%] mb-1" key={i} />
          ))}
        </>
      )}
    </>
  );
}
