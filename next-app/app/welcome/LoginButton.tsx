"use client";

import { Button } from "@/components/ui/button";
import useWeb5 from "@/hooks/useWeb5";
import { loadingAtom } from "@/state/loadingAtom";
import { userDetailsAtom } from "@/state/user/userDetails";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const [, setUserDetails] = useAtom(userDetailsAtom);
  const router = useRouter();
  const [, setLoading] = useAtom(loadingAtom);

  const { did } = useWeb5();

  return (
    <Button
      className="w-80"
      onClick={async () => {
        setLoading(true);

        if (did) {
          setUserDetails({ did: did });

          router.push("/home");

          setLoading(false);
        }
      }}
    >
      Login
    </Button>
  );
}
