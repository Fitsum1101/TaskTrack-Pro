import { apiSlice } from "@/store/apiSlice";

const prefix = "/api/v1/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${prefix}/login`,
        method: "POST",
        data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({ url: `${prefix}logout`, method: "POST" }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApiSlice;
