import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  refetchOnFocus: true,
  endpoints: () => ({}),
  tagTypes: ["role", "permission", "user"],
});
