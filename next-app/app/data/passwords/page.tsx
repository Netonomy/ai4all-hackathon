"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreatePasswordForm from "./CreatePasswordForm";
import PasswordsList from "./PasswordsList";

export default function PasswordsPage() {
  const [searchText, setSearchText] = useState("");
  const [addingPassword, setAddingPassword] = useState(false);

  return (
    <div className="w-full h-full flex  flex-col items-center">
      <div className="flex items-center w-[90%] lg:w-full ">
        {!addingPassword ? (
          <>
            <Input
              type="search"
              placeholder="Search..."
              className="shadow-md rounded-lg mr-2"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              className="shadow-md border "
              variant={"ghost"}
              size={"sm"}
              onClick={() => setAddingPassword(true)}
            >
              <PlusIcon />
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>

      <Card className="flex flex-1 mt-4 mb-2  shadow-md rounded-lg w-[90%] lg:w-full ">
        <CardContent className="flex flex-1 flex-col items-center w-full max-h-[calc(100vh-250px)] overflow-y-auto overflow-x-visible">
          {addingPassword ? (
            <CreatePasswordForm setAddingPassword={setAddingPassword} />
          ) : (
            <PasswordsList searchText={searchText} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
