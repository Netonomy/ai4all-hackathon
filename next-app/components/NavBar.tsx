"use client";
import { Card, CardContent } from "@/components/ui/card";
import { File, Image, Video, Headphones, LockIcon } from "lucide-react";
import NavBarButton from "./buttons/NavBarButton";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { userDetailsAtom } from "@/state/user/userDetails";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { sideSheetOpenAtom } from "@/state/storage/sideSheetOpenAtom";
import { tokenAtom } from "@/state/tokenAtom";

export default function NavBar() {
  const [selectedBtn, setSelectedBtn] = useState(
    window.location.pathname.split("/")[3] || "files"
  );
  const [, setUserDetails] = useAtom(userDetailsAtom);
  const router = useRouter();
  const [, setSheetOpen] = useAtom(sideSheetOpenAtom);
  const [, setToken] = useAtom(tokenAtom);

  const isLargeScreen = window.innerWidth > 1024;

  useEffect(() => {
    const handlePathChange = () => {
      // Logic to handle URL path change
      setSelectedBtn(window.location.pathname.split("/")[3] || "files");
    };

    // Add event listener for 'popstate' event
    window.addEventListener("popstate", handlePathChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  return (
    <motion.div
      initial={isLargeScreen ? { opacity: 0, x: -500, scale: 0.5 } : {}}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={
        isLargeScreen
          ? {
              duration: 1,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }
          : {}
      }
      className="w-[90%] max-w-[335px] shadow-md rounded-lg"
    >
      <Card className="">
        <CardContent>
          <div className="flex flex-col items-center w-full gap-2">
            <NavBarButton
              icon={<File />}
              name="Files"
              selected={selectedBtn === "files"}
              setSelected={setSelectedBtn}
              href="/data"
            />

            <NavBarButton
              icon={<Image />}
              name="Photos"
              selected={selectedBtn === "photos"}
              setSelected={setSelectedBtn}
              href="/data/photos"
            />

            <NavBarButton
              icon={<Video />}
              name="Videos"
              selected={selectedBtn === "videos"}
              setSelected={setSelectedBtn}
              href="/data/videos"
            />
            {/* 
            <NavBarButton
              icon={<Headphones />}
              name="Audio"
              selected={selectedBtn === "audio"}
              setSelected={setSelectedBtn}
              // href="/home/data"
            /> */}

            <NavBarButton
              icon={<LockIcon />}
              name="Passwords"
              selected={selectedBtn === "passwords"}
              setSelected={setSelectedBtn}
              href="/data/passwords"
            />

            {/* <Button
              variant={"ghost"}
              className="w-full flex flex-row items-center justify-start gap-2 font-bold"
              onClick={() => {
                setUserDetails(null);
                setSheetOpen(false);
                setToken(null);
                router.push("/welcome");
              }}
            >
              <LogOut />
              Logout
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
