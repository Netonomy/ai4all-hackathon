"use client";

import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import NavBar from "./NavBar";
import { useAtom } from "jotai";
import { sideSheetOpenAtom } from "@/state/storage/sideSheetOpenAtom";
import { AlignJustify } from "lucide-react";

export default function SideDrawer() {
  const [sheetOpen, setSheetOpen] = useAtom(sideSheetOpenAtom);

  return (
    <div className="lg:hidden absolute top-4 left-4">
      <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
        <SheetTrigger onClick={() => setSheetOpen(true)}>
          <AlignJustify />
        </SheetTrigger>

        <SheetContent
          position="left"
          size="default"
          className="min-w-[350px] md:min-w-[400px]"
        >
          <div className="h-full w-full flex flex-col items-center">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <NavBar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
