import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  loading: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
      state.isAuthenticated = true;
      state.loading = "succeeded";
    },
    clearAuth: (state) => {
      Object.assign(state, initialState);
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle all successful auth operations
      .addMatcher(
        (action) =>
          authApi.endpoints.login.matchFulfilled(action) ||
          authApi.endpoints.refreshToken.matchFulfilled(action),
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.loading = "succeeded";
        }
      )
      // Handle me endpoint
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.loading = "succeeded";
      })
      // Handle logout
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        Object.assign(state, initialState);
      })
      // Handle refresh failure
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;
