import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useSearchProfile from "@/hooks/nostr/useSearchProfile";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useRef, useState } from "react";

export default function ProfileSearch() {
  const [searchText, setSearchText] = useState("");
  const profiles = useSearchProfile(searchText);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showResults, setShowResults] = useState(false);

  useOutsideClick(inputRef, () => {
    setShowResults(false);
  });

  return (
    <div className="w-full relative">
      <Input
        ref={inputRef}
        placeholder="Search by npub..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="shadow-md bg-white dark:bg-black"
        onClick={() => setShowResults(true)}
      />

      {showResults && (
        <div className="absolute top-13 left-0 right-0 h-72 z-30">
          <Card>
            <CardContent>
              {profiles &&
                profiles.length > 0 &&
                profiles.map((profile) => (
                  <div className="flex items-center gap-2 rounded hover:opacity-90 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={JSON.parse(profile.content).picture} />
                    </Avatar>
                    {JSON.parse(profile.content).name}
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
