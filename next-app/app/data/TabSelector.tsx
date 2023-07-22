"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TabSelctor() {
  const [tabValue, setTabValue] = useState(
    window.location.pathname.split("/")[2] || "data"
  );

  useEffect(() => {
    const handlePathChange = () => {
      // Logic to handle URL path change
      setTabValue(window.location.pathname.split("/")[2]);
    };

    // Add event listener for 'popstate' event
    window.addEventListener("popstate", handlePathChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  return (
    <Tabs
      defaultValue={tabValue}
      value={tabValue}
      className="flex h-10 flex-col w-full items-center"
    >
      <div className="space-between flex items-center">
        <TabsList>
          <Link href={"/data"} onClick={() => setTabValue("data")}>
            <TabsTrigger value="data" className="relative">
              Data
            </TabsTrigger>
          </Link>

          <TabsTrigger value="identity" className="relative" disabled>
            Identity
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
