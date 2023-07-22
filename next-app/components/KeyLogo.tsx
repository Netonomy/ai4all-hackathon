"use client";
import useSystemTheme from "@/hooks/useSystemTheme";
import Image from "next/image";

export default function KeyLogo(props: {
  height?: number;
  width?: number;
  className?: string;
  lightGrey?: boolean;
}) {
  const systemTheme = useSystemTheme();

  return (
    <>
      {props.lightGrey ? (
        <Image
          className={props.className}
          src={"/keyLogoLight.png"}
          height={props.height ? props.height : 108}
          width={props.width ? props.width : 161}
          alt="Flame Logo"
          priority
        />
      ) : (
        <>
          {systemTheme && systemTheme === "light" ? (
            <Image
              className={props.className}
              src={"/keyLogoBlack1.png"}
              height={props.height ? props.height : 108}
              width={props.width ? props.width : 161}
              alt="Flame Logo"
              priority
            />
          ) : (
            <Image
              className={props.className}
              src={"/keyLogoWhite1.png"}
              height={props.height ? props.height : 108}
              width={props.width ? props.width : 161}
              alt="Flame Logo"
              priority
            />
          )}
        </>
      )}
    </>
  );
}
