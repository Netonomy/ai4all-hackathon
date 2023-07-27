import PageContainer from "@/components/containers/PageContainer";
import PrivateRoute from "@/components/PrivateRoute";
import Header from "../Header";
import AgentChatBtn from "./AgentChatBtn";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <PageContainer>
        <Header />

        <AgentChatBtn />

        {children}
      </PageContainer>
    </PrivateRoute>
  );
}
