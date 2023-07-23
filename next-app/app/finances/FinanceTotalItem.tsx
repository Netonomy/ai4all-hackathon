import { balanceAtom } from "@/state/finance/balanceAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import axiosInstance from "@/config/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export default function FinanceTotalItem() {
  const balanceQuery = useQuery(
    ["btc-balance"],
    async () => {
      const res = await axiosInstance.get("v1/bitcoin/balance");

      return res.data;
    },
    {
      refetchInterval: 5 * 60000,
    }
  );

  const [balance, setBalance] = useAtom(balanceAtom);

  async function formatBalance() {
    let balance = balanceQuery.data;

    if (balance) {
      const satsString = balance.toString().padStart(9, "0");
      const formatted =
        satsString.slice(0, -8) +
        "." +
        satsString.slice(-8, -6) +
        " " +
        satsString.slice(-6, -3) +
        " " +
        satsString.slice(-3);
      const formattedString = formatted;

      let leadingString = "";
      let actualBalanceString = "";

      for (let i = 0; i < formattedString.length; i++) {
        if (
          formattedString[i] !== "0" &&
          formattedString[i] !== "." &&
          formattedString[i] !== " "
        ) {
          actualBalanceString = formattedString.slice(
            i,
            formattedString.length
          );
          break;
        } else {
          leadingString += formattedString[i];
        }
      }

      setBalance(leadingString + actualBalanceString);
    }
  }

  useEffect(() => {
    if (balanceQuery.data) formatBalance();
  }, [balanceQuery.isLoading]);

  return (
    <>
      {!balanceQuery.isLoading ? (
        <div className="rounded-lg bg-[#F1F5F9] dark:bg-[#1d1d1d] h-9 min-h-[32px] w-full flex items-center justify-between p-2 lg:h-11">
          <p className="text-sm text-muted-foreground lg:text-base">Total</p>

          <div className="text-lg font-medium flex gap-1">
            ₿<div>{balance}</div>
            sats
          </div>
        </div>
      ) : (
        <Skeleton className="rounded-lg bg-[#F1F5F9] dark:bg-[#1d1d1d] h-9 min-h-[32px] w-full flex items-center justify-between p-2 lg:h-11" />
      )}
    </>
  );
}
