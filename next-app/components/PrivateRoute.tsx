"use client";

import { userDetailsAtom } from "@/state/user/userDetails";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: any;
}
export default function PrivateRoute(props: PrivateRouteProps) {
  const router = useRouter();
  const [isBrowser, setIsBrowser] = React.useState(false);
  const [userDetails] = useAtom(userDetailsAtom);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (isBrowser) {
      if (!userDetails) {
        router.push("/welcome");
      }
    }
  }, [isBrowser, userDetails]);

  if (!isBrowser) return <></>;

  return props.children;
}
