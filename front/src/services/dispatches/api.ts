import { axiosInstance } from "../../axios/axiosInstance";
import { Dispatch } from "../../types/Dispatch";
import { PaginatedResponse } from "../../types/pagination";
import { QueryParamsBase } from "../../types/query";

//index
export const getDispatches = async (
  params?: QueryParamsBase
): Promise<PaginatedResponse<Dispatch>> => {
  const { data } = await axiosInstance.get("/api/dispatches", {
    params,
  });
  return data;
};
