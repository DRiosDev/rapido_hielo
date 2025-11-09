import { useQuery } from "@tanstack/react-query";
import { getMe } from "./api";

export function useMe(options?: object) {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}
