"use client";
import FinanceRequestAndPayButtons from "@/components/FinanceRequestAndPayButtons";
import FinanceTotalItem from "@/components/FinanceTotalItem";
import TransactionsList from "@/components/TransactionsList";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowUpDown,
  CheckCircleIcon,
  CopyIcon,
} from "lucide-react";
import KeyPad from "./KeyPad";
import { useState } from "react";
import AvatarProfile from "@/components/AvatarProfile";
import useProfile from "@/hooks/useProfile";
import useWeb5 from "@/hooks/useWeb5";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import QRCode from "react-qr-code";
import useSystemTheme from "@/hooks/useSystemTheme";
import SendReqBtcCard from "./SendReqBtcCard";

export default function FinancesPage() {
  const systemColor = useSystemTheme();

  const { profile } = useProfile();
  const { btcWallet } = useWeb5();

  const [copied, setCopied] = useState(false);

  async function createAddressAndCopyToClipboard() {
    const address = await btcWallet?.generateNewAddress(0);

    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 5000);
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col w-full items-center gap-4 pt-8 pb-8 pl-4 pr-4 overflow-y-auto lg:grid grid-cols-[1fr,1.2fr,1fr] lg:items-start  lg:pt-20 lg:pb-20 lg:pr-12 lg:pl-12">
      <div className="hidden lg:col-span-1 lg:flex flex-col gap-4 h-full ">
        <Card className="h-full flex">
          <CardContent className="h-full flex w-full flex-col items-center pt-12">
            <div className="h-[200px] w-[200px]">
              <AvatarProfile />
            </div>

            <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-[40px]">
              {profile?.name}
            </h3>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="transition-all ease-in w-auto mt-[20px]"
              onClick={createAddressAndCopyToClipboard}
            >
              {!copied ? (
                <div className="flex items-center p-2">
                  <Image
                    src={"/icons/Copy.svg"}
                    height={30}
                    width={30}
                    alt="Copy Address"
                  />

                  <small className="text-sm font-medium leading-none">
                    Copy Address
                  </small>
                </div>
              ) : (
                <CheckCircleIcon />
              )}
            </Button>

            <QRCode
              value=""
              height={256}
              width={237}
              fgColor={systemColor === "light" ? "black" : "white"}
              bgColor={systemColor === "light" ? "white" : "black"}
              style={{
                marginTop: "10px",
                marginBottom: "20px",
              }}
            />

            <p className="text-sm text-muted-foreground">
              Scan for your bitcoin address.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:col-span-1 flex flex-col gap-4 h-full">
        {/* <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Accounts
        </h4> */}

        <Card>
          <CardContent>
            <FinanceTotalItem />
          </CardContent>
        </Card>

        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Activity
        </h4>

        <Card className="h-full flex">
          <CardContent className="h-full flex w-full">
            <TransactionsList />
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:col-span-1 lg:flex flex-col gap-4 h-full">
        <SendReqBtcCard />
      </div>
    </div>
  );
}
