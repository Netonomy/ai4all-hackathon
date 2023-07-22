import { ReactNode, useRef, useState } from "react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function ListItem(props: {
  icon: ReactNode;
  title: string;
  recordId: string;
  subTitle: string;
  onDelete?: any;
  onClick?: any;
  updateFilename?: (newName: string, recordId: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(inputRef, () => {
    if (editing) {
      if (props.updateFilename) props.updateFilename(name, props.recordId);
      setEditing(false);
    }
  });

  return (
    <div
      className={`h-14 w-full rounded-lg flex flex-row items-center p-2 ${
        !editing ? "hover:bg-gray-100 dark:hover:bg-[#1d1d1d]" : ""
      } hover:cursor-pointer transition overflow-x-visible`}
      onClick={(e) => {
        e.stopPropagation();
        if (!editing) props.onClick();
      }}
    >
      {props.icon}

      <div className="flex flex-1 flex-col ml-4 gap-[2px]">
        {!editing || !props.updateFilename ? (
          <div className="text-md md:text-lg font-normal max-w-[221px] sm:max-w-[400px] xl:max-w-[400px] truncate">
            {props.title}
          </div>
        ) : (
          <Input
            autoFocus
            //   ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={async () => {
              if (props.updateFilename)
                props.updateFilename(name, props.recordId);
              setEditing(false);
            }}
          />
        )}

        <small className="text-sm text-gray-500 font-medium leading-none">
          {props.subTitle}
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
              props.onDelete();
            }}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
