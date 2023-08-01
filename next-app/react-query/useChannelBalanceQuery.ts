import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export default function useChannelBalanceQuery() {
  return useQuery(["ChannelBalance"], async () => {
    const res = await axiosInstance.get("v1/lightning/channelBalance");

    return res.data;
  });
}
