"use client";
import useWeb5 from "@/hooks/useWeb5";
import TransactionDetails, {
  TransactionType,
} from "@/types/TransactionDetails";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useAtom } from "jotai";
import { transactionsAtom } from "@/state/finance/transactionsAtom";
import { timeStampToTimeAgo } from "@/utils/timestampToTimeAgo";

export default function TransactionsList() {
  const { btcWallet } = useWeb5();
  const [transactions, setTransactions] = useAtom(transactionsAtom);

  async function fetchTransactions() {
    const transactions = await btcWallet?.getWalletTransactionsWithDetails();
    if (transactions)
      setTransactions(transactions.sort((a, b) => b.time - a.time));
  }

  useEffect(() => {
    fetchTransactions();

    const intervalId = setInterval(fetchTransactions, 5 * 60 * 1000); // fetch every 5 minutes

    return () => clearInterval(intervalId); // clear interval on component unmount
  }, [btcWallet]);

  return (
    <div className="flex flex-col flex-1 p-2 items-center w-full overflow-y-auto ">
      {!transactions ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full h-12 min-h-[48px] lg:min-h-[55px] rounded-lg p-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#1d1d1d] mb-1"
          />
        ))
      ) : (
        <>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                className="w-full h-12 min-h-[48px] lg:min-h-[55px] rounded-lg p-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#1d1d1d] cursor-pointer"
                key={transaction.hash}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="relative h-7 w-7 lg:h-10 lg:w-10">
                  {transaction.type === TransactionType.withdraw && (
                    <Image src={"/withdrawIcon.svg"} alt="withdraw" fill />
                  )}
                  {transaction.type === TransactionType.deposit && (
                    <Image src={"/depositIcon.svg"} alt="deposit" fill />
                  )}
                </div>

                <div className="flex flex-1 flex-col h-auto justify-center">
                  <p className="max-w-[300px] truncate">
                    {transaction.type === TransactionType.deposit
                      ? transaction.fromAddresses![0]
                      : transaction.toAddresses![0]}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {timeStampToTimeAgo(transaction.time)}
                  </p>
                </div>

                <div className="">
                  <small
                    className={`text-sm font-medium leading-none ${
                      transaction.type === TransactionType.deposit
                        ? "text-[#27AE60]"
                        : "text-[#AE2727]"
                    }`}
                  >
                    {transaction.amount}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full w-full flex items-center justify-center ">
              No Transactions.
            </div>
          )}
        </>
      )}
    </div>
  );
}
