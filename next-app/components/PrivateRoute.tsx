"use client";

import { tokenAtom } from "@/state/tokenAtom";
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
  // const [userDetails] = useAtom(userDetailsAtom);
  const [token] = useAtom(tokenAtom);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (isBrowser) {
      if (!token) {
        router.push("/welcome");
      }
    }
  }, [isBrowser, token]);

  if (!isBrowser) return <></>;

  return props.children;
}
