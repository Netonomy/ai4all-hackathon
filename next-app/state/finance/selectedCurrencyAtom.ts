import { Currency } from "@/types/Currency";
import { atomWithStorage } from "jotai/utils";

const btcCurrency: Currency = {
  symbol: "₿",
  name: "BTC",
};

export const selectedCurrencyAtom = atomWithStorage<Currency>(
  "selected-currency",
  btcCurrency
);
