import BackBtn from "@/components/BackBtn";
import PageContainer from "@/components/containers/PageContainer";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
      <BackBtn />
      {children}
    </PageContainer>
  );
}
