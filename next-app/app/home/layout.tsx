import PageContainer from "@/components/containers/PageContainer";
import PrivateRoute from "@/components/PrivateRoute";
import AgentChatBtn from "./AgentChatBtn";
import Header from "@/components/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <PageContainer>
        <Header />

        {/* <AgentChatBtn /> */}

        {children}
      </PageContainer>
    </PrivateRoute>
  );
}
