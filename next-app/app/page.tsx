"use client";
import PrivateRoute from "@/components/PrivateRoute";
import PageContainer from "@/components/containers/PageContainer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, []);

  return (
    <PrivateRoute>
      <PageContainer>
        <></>
      </PageContainer>
    </PrivateRoute>
  );
}
