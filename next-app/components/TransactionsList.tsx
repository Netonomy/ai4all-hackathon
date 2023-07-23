import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { timeStampToTimeAgo } from "@/utils/timestampToTimeAgo";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export default function TransactionsList() {
  const transactionsQuery = useQuery(["btc-transactions"], async () => {
    const res = await axiosInstance.get("v1/bitcoin/transactions");

    return res.data.sort((a, b) => {
      const date1 = new Date(a.created_at);
      const date2 = new Date(b.created_at);

      return date2.getTime() - date1.getTime();
    });
  });

  return (
    <div className="flex flex-col flex-1 items-center w-full overflow-y-auto">
      {transactionsQuery.isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full h-12 min-h-[48px] lg:min-h-[55px] rounded-lg p-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#1d1d1d] mb-1"
          />
        ))
      ) : (
        <>
          {transactionsQuery.data && transactionsQuery.data.length > 0 ? (
            transactionsQuery.data.map((transaction) => (
              <div
                className="w-full h-12 min-h-[48px] lg:min-h-[55px] rounded-lg p-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#1d1d1d] cursor-pointer"
                key={transaction.transaction}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="relative h-7 w-7 lg:h-10 lg:w-10">
                  {transaction.is_outgoing ? (
                    <Image src={"/depositIcon.svg"} alt="deposit" fill />
                  ) : (
                    <Image src={"/withdrawIcon.svg"} alt="withdraw" fill />
                  )}
                </div>

                <div className="flex flex-1 flex-col h-auto justify-center">
                  <p className="max-w-[300px] truncate">
                    {transaction.output_addresses[0]}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {timeStampToTimeAgo(
                      new Date(transaction.created_at as string).getTime() /
                        1000
                    )}
                  </p>
                </div>

                <div className="w-max">
                  <small
                    className={`text-sm font-medium leading-none ${
                      transaction.is_outgoing
                        ? "text-[#27AE60]"
                        : "text-[#AE2727]"
                    }`}
                  >
                    {transaction.tokens} sats
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
