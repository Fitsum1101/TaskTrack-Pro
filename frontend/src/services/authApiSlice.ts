import type { LoginFormType } from "@/schema/authSchema";
import { apiSlice } from "@/store/apiSlice";
import type { AuthUserProfile } from "@/types/new/user";

const prefix = "/api/v1/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthUserProfile, LoginFormType>({
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
