"use client";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import FileItemIcon from "./FileItemIcon";
import { motion } from "framer-motion";
import useWeb5 from "@/hooks/useWeb5";
import DigitalDocument from "@/types/DigitalDocument";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { filesAtom } from "@/state/storage/filesAtom";
import { loadingAtom } from "@/state/loadingAtom";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import useOutsideClick from "@/hooks/useOutsideClick";

interface FileListItemProps {
  document: DigitalDocument;
}
export default function FileListItem(props: FileListItemProps) {
  const { web5 } = useWeb5();
  const [files, setFiles] = useAtom(filesAtom);
  const [, setLoading] = useAtom(loadingAtom);
  const [editing, setEditing] = useState(false);
  const [fileName, setFileName] = useState(props.document.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(inputRef, () => {
    if (editing) {
      UpdateFileName(fileName);
      setEditing(false);
    }
  });

  function OpenFile() {
    if (web5 && !editing) {
      setLoading(true);
      web5.dwn.records
        .read({
          message: {
            recordId: props.document.url,
          },
        })
        .then((blobResult: any) => {
          if (blobResult.records && blobResult.records.length > 0) {
            blobResult.records[0].data.blob().then((blob: any) => {
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
              setLoading(false);
            });
          }
        });
    }
  }

  async function DeleteFile() {
    if (web5) {
      setLoading(true);

      try {
        const deleteRes = await web5.dwn.records.delete({
          message: {
            recordId: props.document.identifier,
          },
        });

        setFiles((prevFiles) =>
          prevFiles.filter(
            (file) => file.identifier !== props.document.identifier
          )
        );
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }
  }

  async function UpdateFileName(newName: string) {
    if (web5) {
      try {
        // Update files state to reflect new file name
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.identifier === props.document.identifier
              ? { ...file, name: newName }
              : file
          )
        );

        // Fetch file to be updated
        const fileRes = await web5.dwn.records.read({
          message: {
            recordId: props.document.identifier,
          },
        });

        if (fileRes.record) {
          let file = fileRes.record;
          let fileData: DigitalDocument = await file.data.json();
          fileData.name = newName;

          await file.update({
            data: fileData,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <motion.div
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
      }}
      whileTap={
        !editing
          ? {
              scale: 0.95,
            }
          : {}
      }
      className={`h-14 w-full rounded-lg flex flex-row items-center p-2 ${
        !editing ? "hover:bg-gray-100 dark:hover:bg-[#1d1d1d]" : ""
      } hover:cursor-pointer transition overflow-x-visible z-50`}
      onClick={OpenFile}
    >
      <FileItemIcon type={props.document.encodingFormat} />

      <div className="flex flex-1 flex-col ml-4 gap-[2px]">
        {!editing ? (
          <div className="text-md md:text-lg font-normal max-w-[221px] sm:max-w-[400px] xl:max-w-[400px] truncate">
            {props.document.name}
          </div>
        ) : (
          <Input
            autoFocus
            ref={inputRef}
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onBlur={async () => {
              await UpdateFileName(fileName);
              setEditing(false);
            }}
          />
        )}

        <small className="text-sm text-gray-500 font-medium leading-none">
          {new Date(props.document.datePublished).toLocaleDateString()}
        </small>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="hover:bg-gray-200 dark:hover:opacity-80 dark:hover:hover:bg-[#0d0d0d] p-2 h-9 w-9 rounded-full" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              setEditing(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              DeleteFile();
            }}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
