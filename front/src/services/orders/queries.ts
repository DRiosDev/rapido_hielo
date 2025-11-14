import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryParamsBase } from "../../types/query";
import { isBaseQueryParams } from "../../helpers/isBaseQueryParams";
import { getOrders } from "./api";

const STALE_TIME_BASE = 1000 * 60 * 60; // 60 minutos

export function useOrders(params?: QueryParamsBase, options?: object) {
  const isBaseQuery = isBaseQueryParams(params); // Si la consulta es la base (sin filtros y la primera pagina)

  const paramsQuery = isBaseQuery ? undefined : params;

  const query = useQuery({
    queryKey: ["orders", paramsQuery],
    queryFn: () => getOrders(paramsQuery),
    staleTime: isBaseQuery ? STALE_TIME_BASE : 0,
    gcTime: isBaseQuery ? STALE_TIME_BASE : 0,
    placeholderData: keepPreviousData,
    ...options,
  });

  return { ...query, isBaseQuery };
}
