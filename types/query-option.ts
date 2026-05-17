import { ApiRequestError, ApiResponse } from "@/lib/api/api";
import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
export type QueryOptions<T, TData> = Omit<
  UseQueryOptions<ApiResponse<T>, ApiRequestError, TData>,
  "queryKey" | "queryFn"
>;

export type CustomInfiniteQueryOptions<
  TQueryFnData,
  TData = InfiniteData<TQueryFnData>,
  TPageParam = string | null,
> = Omit<
  UseInfiniteQueryOptions<
    TQueryFnData,
    ApiRequestError,
    TData,
    QueryKey,
    TPageParam
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;
