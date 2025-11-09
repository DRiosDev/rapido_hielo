import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "./api";

export const useUsersInfinite = (search) => {
  return useInfiniteQuery({
    queryKey: ["users", { search }],
    queryFn: fetchUsers,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loadedItems = allPages.flatMap((p) => p.items).length;
      return loadedItems < lastPage.total ? lastPageParam + 1 : undefined;
    },
  });
};
