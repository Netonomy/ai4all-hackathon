"use client";
import { Button } from "@/components/ui/button";
import { sideSheetOpenAtom } from "@/state/storage/sideSheetOpenAtom";
import { useAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

interface NavBarButtonProps {
  icon: ReactNode;
  name: string;
  selected?: boolean;
  setSelected: any;
  href?: string;
}

export default function NavBarButton(props: NavBarButtonProps) {
  const [, setSheetOpen] = useAtom(sideSheetOpenAtom);
  const router = useRouter();

  return (
    // <Link href={props.href} className="w-full h-full">
    <motion.div whileTap={{ scale: 0.97 }} className="w-full h-full">
      <Button
        onClick={() => {
          if (props.href) {
            props.setSelected(props.name.toLocaleLowerCase());
            setSheetOpen(false);
            router.push(props.href);
          }
        }}
        variant={"secondary"}
        className={`w-full flex flex-row items-center justify-start gap-2 ${
          props.selected ? "text-black dark:text-white" : "text-gray-400"
        }`}
      >
        {props.icon}
        <div className="flex flex-1 ">{props.name}</div>
        <ChevronRight />
      </Button>
    </motion.div>
    // </Link>
  );
}
