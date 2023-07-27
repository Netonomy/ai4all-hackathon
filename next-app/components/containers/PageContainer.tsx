import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}
export default function PageContainer(props: PageContainerProps) {
  return (
    <div className="h-screen max-h-[-webkit-fill-available] overflow-hiddenx w-full items-center flex flex-col ">
      {/* <div className="h-full w-full flex flex-col items-center"> */}
      {props.children}
      {/* </div> */}
    </div>
  );
}
