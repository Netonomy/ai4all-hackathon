"use client";

import KeyLogo from "@/components/KeyLogo";
import PageContainer from "@/components/containers/PageContainer";
import { Button } from "@/components/ui/button";
import LoginButton from "./LoginButton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { useAtom } from "jotai";
import { tokenAtom } from "@/state/tokenAtom";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const [password, setPassword] = useState("");
  const [, setToken] = useAtom(tokenAtom);
  const router = useRouter();

  async function login() {
    if (password === "") return "";

    const res = await axiosInstance.post("v1/auth/login", {
      password,
    });

    if (res.status === 200) {
      const token = res.data.bearerToken;
      setToken(token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      router.push("/home");
    }
  }

  return (
    <PageContainer>
      <div className="flex h-[95%] flex-col items-center justify-center gap-8">
        <div className="flex flex-col flex-1 justify-center items-center gap-6">
          <KeyLogo />
          <div className="flex flex-col items-center gap-3 mb-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
              Netonomy Wallet
            </h1>

            <div className="text-lg font-normal text-center text-gray-400 max-w-[335px] sm:max-w-full">
              Own your digital identity, data, and finances.
            </div>
          </div>

          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            className="w-80"
            onClick={async () => {
              login();
            }}
          >
            Login
          </Button>

          {/* <Link href={"/register"}>
            <Button variant={"ghost"} className="w-80">
              Register
            </Button>
          </Link> */}
        </div>
      </div>

      {/* <p className="text-sm text-muted-foreground p-6">
        Your wallet, your data. 100% open source.
      </p> */}
    </PageContainer>
  );
}
