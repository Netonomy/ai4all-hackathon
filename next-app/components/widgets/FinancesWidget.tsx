"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TransactionsList from "../TransactionsList";
import { useRouter } from "next/navigation";
import FinanceTotalItem from "../../app/finances/FinanceTotalItem";
import FinanceRequestAndPayButtons from "../FinanceRequestAndPayButtons";

export default function FinancesWidget() {
  const router = useRouter();

  return (
    <Card
      className="  cursor-pointer rounded-2xl  w-[90%] max-w-[335px] max-h-[350px]"
      onClick={() => router.push("/finances")}
    >
      <CardContent className="flex flex-col items-center h-full gap-3">
        <FinanceTotalItem />

        <TransactionsList />

        <FinanceRequestAndPayButtons />
      </CardContent>
    </Card>
  );
}
