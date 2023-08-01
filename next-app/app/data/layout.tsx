import { ReactNode } from "react";
import NavBar from "../../components/NavBar";
import SideDrawer from "../../components/SideDrawer";
import PageContainer from "@/components/containers/PageContainer";
import TabSelctor from "./TabSelector";
import BackBtn from "@/components/BackBtn";
import Header from "@/app/Header";

export default function StorageLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer>
      <BackBtn path="/home" />
      <Header showBackBtn />

      <div className="min-h-[60px]" />

      <div className="flex flex-1 w-full flex-row items-center mb-4">
        <SideDrawer />

        <div className="w-0 h-0 hidden flex-col items-center  lg:flex lg:h-full  lg:w-[30%]  pt-[40px] ">
          <NavBar />
        </div>

        <div className="w-full h-full pt-[40px] flex flex-col items-center lg:w-[60%] xl:w-[40%]">
          {children}
        </div>

        {/* <div className="h-0 w-0 xl:w-[30%] lg:h-full"></div> */}
      </div>
    </PageContainer>
  );
}
