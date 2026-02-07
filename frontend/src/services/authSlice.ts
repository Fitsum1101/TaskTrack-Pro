import { LoginFormDataType } from "@/app/auth/_schema/login-schema";
import { apiSlice } from "@/store/apiSlice";
import { AuthResponse, AuthResponseData } from "@/types/auth";

const prefix = "/api/v1/auth/";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==============================
    // PUBLIC ROUTES
    // ==============================

    login: builder.mutation<AuthResponseData, LoginFormDataType>({
      query: (body) => ({
        url: `${prefix}login`,
        method: "POST",
        data: body,
      }),
      transformResponse: (response: AuthResponse) => response.data,
      invalidatesTags: ["role", "permission"],
    }),

    register: builder.mutation({
      query: (body) => ({
        url: `${prefix}register`,
        method: "POST",
        data: body,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `${prefix}forgot-password`,
        method: "POST",
        data: body,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `${prefix}reset-password/${token}`,
        method: "POST",
        data: body,
      }),
    }),

    verifyResetToken: builder.mutation({
      query: (body) => ({
        url: `${prefix}verify-token`,
        method: "POST",
        data: body,
      }),
    }),

    // ==============================
    // PROTECTED ROUTES
    // ==============================

    logout: builder.mutation({
      query: (body) => ({
        url: `${prefix}logout`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["role", "permission", "user"], // clear user cache
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: `${prefix}update-password`,
        method: "POST",
        data: body,
      }),
    }),

    refreshTokens: builder.mutation({
      query: () => ({
        url: `${prefix}refresh-token`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetTokenMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRefreshTokensMutation,
} = authApiSlice;
