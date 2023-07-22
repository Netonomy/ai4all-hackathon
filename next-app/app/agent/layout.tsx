import PageContainer from "@/components/containers/PageContainer";
import PrivateRoute from "@/components/PrivateRoute";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
