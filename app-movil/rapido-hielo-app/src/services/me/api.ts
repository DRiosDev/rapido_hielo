import { axiosInstance } from "@/axios/axiosInstance";
import { User } from "@/types/User";

export const getMe = async (): Promise<User> => {
  const { data } = await axiosInstance.get("/api/me");
  return data;
};
