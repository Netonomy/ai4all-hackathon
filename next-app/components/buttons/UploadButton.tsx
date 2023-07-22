import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";
import { useRef } from "react";

interface UploadFilesBtnProps {
  accept: string;
  onFilesChange: (files: FileList | null) => void;
}

export default function UploadButton(props: UploadFilesBtnProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    props.onFilesChange(files);
  };

  return (
    <>
      <Button
        className="shadow-md border "
        variant={"ghost"}
        size={"sm"}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <FileUp />
      </Button>
      <Input
        type="file"
        multiple
        accept={props.accept}
        id="my-input"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
      />
    </>
  );
}
