import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        meta: { skipAuth: true },
      }),
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        meta: { skipAuth: true },
      }),
    }),

    me: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
        meta: { skipAuth: true },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: { password },
        meta: { skipAuth: true },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useMeQuery,
} = authApi;
