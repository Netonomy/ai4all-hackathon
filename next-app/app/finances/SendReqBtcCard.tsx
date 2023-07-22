import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import KeyPad from "./KeyPad";
import { useEffect, useState } from "react";
import FinanceRequestAndPayButtons from "@/components/FinanceRequestAndPayButtons";
import { useAtom } from "jotai";
import { selectedCurrencyAtom } from "@/state/finance/selectedCurrencyAtom";

export default function SendReqBtcCard() {
  const [amount, setAmount] = useState(0);
  const [hasDecimal, setHasDecimal] = useState<boolean>(false);
  const [conversionRate, setConversionRate] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);

  async function fetchBitcoinToUsdRate() {
    const response = await fetch("https://blockchain.info/ticker");
    const data = await response.json();

    return data["USD"].last;
  }

  useEffect(() => {
    fetchBitcoinToUsdRate().then((rate) => setConversionRate(rate));
  }, []);

  function changeSelectedCurrency() {
    if (selectedCurrency.name === "BTC") {
      setSelectedCurrency({
        name: "USD",
        symbol: "$",
      });
      setAmount(amount * conversionRate);
    } else {
      setSelectedCurrency({
        name: "BTC",
        symbol: "₿",
      });
      setAmount(amount / conversionRate);
    }
    fetchBitcoinToUsdRate().then(setConversionRate);
  }

  const alternativeAmount = (
    selectedCurrency.name === "BTC"
      ? amount * conversionRate
      : amount / conversionRate
  ).toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });

  const alternativeCurrency = selectedCurrency.name === "BTC" ? "USD" : "BTC";
  const alternativeSymbol = selectedCurrency.name === "BTC" ? "$" : "₿";

  return (
    <Card className="h-full flex">
      <CardContent className="h-full flex flex-col w-full">
        <div className="flex h-80 items-center justify-center relative flex-col gap-2">
          <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl relative">
            {selectedCurrency.symbol}
            {amount.toLocaleString(undefined, {
              maximumFractionDigits: 8,
            })}{" "}
            {selectedCurrency.name}
          </h1>

          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-auto flex items-center justify-center gap-1"
            onClick={changeSelectedCurrency}
          >
            <small className="text-sm font-medium">
              {alternativeSymbol}
              {alternativeAmount} {alternativeCurrency}
            </small>
            <ArrowUpDown height={14} width={14} />
          </Button>
        </div>

        <KeyPad
          onButtonClick={(text) => {
            // handle backspace
            if (text === "<") {
              setAmount((oldAmount) => {
                let newAmount = oldAmount.toString().slice(0, -1);
                return newAmount ? parseFloat(newAmount) : 0.0;
              });
            }
            // handle decimal point
            else if (text === ".") {
              setAmount((oldAmount) => {
                let newAmount = oldAmount.toString();
                // Prevent adding another decimal if one already exists
                if (!newAmount.includes(".")) {
                  newAmount += ".";
                }
                return parseFloat(newAmount);
              });
            }
            // handle numbers
            else {
              setAmount((oldAmount) => {
                let newAmount = oldAmount.toString() + text;
                return parseFloat(newAmount);
              });
            }
          }}
        />

        <FinanceRequestAndPayButtons />
      </CardContent>
    </Card>
  );
}
