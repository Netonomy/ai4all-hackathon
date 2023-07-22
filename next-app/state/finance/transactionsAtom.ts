import TransactionDetails from "@/types/TransactionDetails";
import { atomWithStorage } from "jotai/utils";

export const transactionsAtom = atomWithStorage<TransactionDetails[] | null>(
  "btc-txs",
  null
);
