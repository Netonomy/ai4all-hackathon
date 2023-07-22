"use client";
import KeyLogo from "@/components/KeyLogo";
import { Skeleton } from "@/components/ui/skeleton";
import useProfile from "@/hooks/useProfile";
import AvatarProfile from "../../components/AvatarProfile";

function Header() {
  const { profile } = useProfile();

  return (
    <div className="w-full min-h-[120px] flex flex-row items-center justify-center relative">
      {/* <KeyLogo
        height={32}
        width={49}
        className="hidden absolute left-7 lg:flex"
        lightGrey
      /> */}

      <div className="gap-2 flex flex-row items-center">
        <AvatarProfile />

        {!profile ? (
          <Skeleton className="h-8 w-[250px]" />
        ) : (
          <>
            <div className="font-light text-[31px]">Hello </div>
            <div className="font-semibold text-[31px]">
              {profile.name.split(" ")[0]}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
