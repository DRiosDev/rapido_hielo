import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "./api";

export function useDashboardData(options?: object) {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
