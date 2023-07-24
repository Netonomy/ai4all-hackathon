import PageContainer from "@/components/containers/PageContainer";
import PrivateRoute from "@/components/PrivateRoute";
import Header from "../header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <PageContainer>
        <Header />
        {children}
      </PageContainer>
    </PrivateRoute>
  );
}
