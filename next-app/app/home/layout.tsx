import PageContainer from "@/components/containers/PageContainer";
import PrivateRoute from "@/components/PrivateRoute";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <PageContainer>{children}</PageContainer>
    </PrivateRoute>
  );
}
