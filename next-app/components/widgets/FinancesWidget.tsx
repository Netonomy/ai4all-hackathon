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
      className="w-full  cursor-pointer rounded-3xl h-[400px]"
      onClick={() => router.push("/finances")}
    >
      <CardContent className="flex flex-col items-center h-full">
        <FinanceTotalItem />

        <TransactionsList />

        <FinanceRequestAndPayButtons />
      </CardContent>
    </Card>
  );
}
