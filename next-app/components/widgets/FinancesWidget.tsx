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
      className="w-full h-[237px] min-h-[237px] lg:h-full cursor-pointer"
      onClick={() => router.push("/finances")}
    >
      <CardHeader className="hidden lg:flex pt-4 pl-4">
        <CardTitle>Finances</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center h-[94%]">
        <FinanceTotalItem />

        <TransactionsList />

        <FinanceRequestAndPayButtons />
      </CardContent>
    </Card>
  );
}
