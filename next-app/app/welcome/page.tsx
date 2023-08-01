"use client";
import KeyLogo from "@/components/KeyLogo";
import PageContainer from "@/components/containers/PageContainer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { useAtom } from "jotai";
import { tokenAtom } from "@/state/tokenAtom";
import { useRouter } from "next/navigation";
import { loadingAtom } from "@/state/loadingAtom";
import Link from "next/link";
import useLogin from "@/react-query/useLoginMutation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getPublicKey } from "nostr-tools";
import { privateKeyHexAtom } from "@/state/privatekeyHexAtom";
import { pool, relays } from "@/config";
import { isLoggedInAtom } from "@/state/user/isLoggedIn";
import { firstLoginAtom } from "@/state/user/firstLogIn";

export default function Welcome() {
  const [macaroon, setMacaroon] = useState("");
  const [, setToken] = useAtom(tokenAtom);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [, setPrivateKey] = useAtom(privateKeyHexAtom);
  const [, setLoggedIn] = useAtom(isLoggedInAtom);

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [firstLogIn, setFIrstlogin] = useAtom(firstLoginAtom);

  const login = useLogin();

  return (
    <PageContainer>
      <div className="flex h-[95%] flex-col items-center justify-center gap-8">
        <div className="flex flex-col flex-1 justify-center items-center gap-6">
          <KeyLogo />
          <div className="flex flex-col items-center gap-3 mb-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
              Netonomy
            </h1>

            <div className="text-lg font-normal text-center text-gray-400 max-w-[335px] sm:max-w-full">
              Own your digital identity, data, and finances.
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            className="w-80"
            onClick={async () => {
              // setShowLoginDialog(true);
              try {
                if (typeof (window as any).webln !== "undefined") {
                  await (window as any).webln.enable();

                  const pubkey = await (window as any).nostr.getPublicKey();

                  const profile = await pool.get(relays, {
                    kinds: [0],
                    authors: [pubkey],
                  });

                  if (!profile || firstLogIn) {
                    setFIrstlogin(false);
                    router.push("/register");
                  } else {
                    setLoggedIn(true);
                    router.push("/home");
                  }
                }
              } catch (error) {
                // User denied permission or cancelled
                console.log(error);
              }
            }}
            disabled={loading}
          >
            Login
          </Button>

          {/* <Link href={"/register"}>
            <Button variant={"ghost"} className="w-80">
              Create Profile
            </Button>
          </Link> */}
        </div>
      </div>

      <Dialog
        open={showLoginDialog}
        onOpenChange={() => setShowLoginDialog(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload profile file</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-2 p-1">
            <Input
              id="file"
              type="file"
              accept=".json"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];

                  const fileReader = new FileReader();
                  fileReader.readAsText(file, "UTF-8");
                  fileReader.onload = (e) => {
                    if (e.target?.result) {
                      let ionOps = JSON.parse(e.target.result.toString());

                      // If the parsed result is a string, attempt to parse it as JSON again.
                      if (typeof ionOps === "string") {
                        try {
                          ionOps = JSON.parse(ionOps);
                        } catch (e) {
                          console.error(
                            "Could not parse the string a second time.",
                            e
                          );
                        }
                      }

                      const macaroon = ionOps[1].macaroon;
                      setMacaroon(macaroon);

                      const privateKeyBase64 = ionOps[0].recovery.privateJwk.d;
                      const buffer = Buffer.from(privateKeyBase64, "base64");
                      const hexPrivateKey = buffer.toString("hex");

                      setPrivateKey(hexPrivateKey);
                    }
                  };
                } else {
                  console.error("Please select a JSON file");
                }
              }}
            />

            {error && (
              <small className="text-sm font-medium leading-none text-red-600">
                Invalid Macaroon
              </small>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                setLoading(true);
                login.mutate(macaroon, {
                  onSuccess: (res) => {
                    const token = res.data.bearerToken;
                    setToken(token);
                    axiosInstance.defaults.headers.common[
                      "Authorization"
                    ] = `Bearer ${token}`;
                    setLoading(false);

                    router.push("/home");
                  },
                  onError: () => {
                    setLoading(false);
                    setError(true);
                  },
                });
              }}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <p className="text-sm text-muted-foreground p-6">
        Your wallet, your data. 100% open source.
      </p> */}
    </PageContainer>
  );
}
