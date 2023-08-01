"use client";

import { tokenAtom } from "@/state/tokenAtom";
import { isLoggedInAtom } from "@/state/user/isLoggedIn";
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
  const [loggedin] = useAtom(isLoggedInAtom);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (isBrowser) {
      if (!loggedin) {
        router.push("/welcome");
      }
    }
  }, [isBrowser, loggedin]);

  if (!isBrowser) return <></>;

  return props.children;
}
