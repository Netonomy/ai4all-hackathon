"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FilesList from "@/app/data/FilesList";
import { motion } from "framer-motion";

export default function DataWidget() {
  const router = useRouter();
  return (
    <Card
      className="w-full  z-0 cursor-pointer rounded-2xl"
      onClick={(e) => {
        router.push("data");
      }}
    >
      <CardHeader className="pl-4 pt-3">
        <CardTitle>Storage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col max-h-[400px] w-full overflow-y-auto">
        <FilesList searchText="" />
      </CardContent>
    </Card>
  );
}
