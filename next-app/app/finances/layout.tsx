import BackBtn from "@/components/BackBtn";
import PrivateRoute from "@/components/PrivateRoute";
import PageContainer from "@/components/containers/PageContainer";
import { ReactNode } from "react";

export default function FinancesLayout({ children }: { children: ReactNode }) {
  return (
    <PrivateRoute>
      <PageContainer>
        <BackBtn path="/home" />
        {children}
      </PageContainer>
    </PrivateRoute>
  );
}
