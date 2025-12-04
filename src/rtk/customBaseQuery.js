import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { setAuth, clearAuth } from "./features/authSlice";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const customBaseQuery = async (args, api, extraOptions) => {
  // Skip auth handling for public endpoints
  if (args?.meta?.skipAuth) {
    return rawBaseQuery(args, api, extraOptions);
  }

  // Initial request
  let result = await rawBaseQuery(args, api, extraOptions);

  // If 401, try to refresh token
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => rawBaseQuery(args, api, extraOptions))
        .catch(() => result);
    }

    isRefreshing = true;

    try {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          meta: { skipAuth: true },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Update store with new tokens
        api.dispatch(
          setAuth({
            accessToken: refreshResult.data.accessToken,
            user: refreshResult.data.user,
          })
        );

        // Process queued requests
        processQueue(null, refreshResult.data.accessToken);

        // Retry original request
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout
        processQueue(new Error("Refresh failed"));
        api.dispatch(clearAuth());

        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    } catch (error) {
      processQueue(error);
      api.dispatch(clearAuth());

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    } finally {
      isRefreshing = false;
    }
  }

  return result;
};
