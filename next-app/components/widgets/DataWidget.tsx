"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FilesList from "@/app/data/FilesList";
import { motion } from "framer-motion";

export default function DataWidget() {
  const router = useRouter();
  return (
    <Card
      className="w-full h-full z-0 cursor-pointer"
      onClick={(e) => {
        router.push("data");
      }}
    >
      <CardHeader className=" flex pt-4 pl-4">
        <CardTitle>Data</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[90%] flex-col w-full overflow-y-auto">
        <FilesList searchText="" />
      </CardContent>
    </Card>
  );
}
