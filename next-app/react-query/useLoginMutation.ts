import axiosInstance from "@/config/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export default function useLoginMutation() {
  return useMutation({
    mutationFn: async (macaroon: string) => {
      const res = await axiosInstance.post("v1/auth/login", {
        macaroon,
      });

      return res;
    },
  });
}
