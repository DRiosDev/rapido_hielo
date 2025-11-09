import { axiosInstance } from "@/axios/axiosInstance";

export const fetchUsers = async ({ pageParam = 1, queryKey }) => {
  const [_key, { search }] = queryKey;

  const response = await axiosInstance.get("/api/users", {
    params: {
      current: pageParam,
      filters: {
        all: [search ?? ""],
      },
    },
  });

  return {
    items: response.data.data,
    total: response.data.total,
  };
};
