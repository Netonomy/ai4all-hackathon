import useSystemTheme from "@/hooks/useSystemTheme";
import { RingLoader } from "react-spinners";

export default function MyRingLoader() {
  const systemTheme = useSystemTheme();

  return (
    <RingLoader
      className="absolute z-30 top-0 left-0 right-0 "
      loading
      color={systemTheme === "dark" ? "#fff" : "#000"}
    />
  );
}
