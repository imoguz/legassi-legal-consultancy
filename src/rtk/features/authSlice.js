import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearAuth: (state) => {
      Object.assign(state, initialState);
      state.loading = false;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle successful login
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.loading = false;
        }
      )
      // Handle successful refresh token
      .addMatcher(
        authApi.endpoints.refreshToken.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.loading = false;
        }
      )
      // Handle me loading
      .addMatcher(authApi.endpoints.me.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state) => {
        state.loading = false;
      })
      // Handle logout
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        Object.assign(state, initialState);
        state.loading = false;
      })
      // Handle refresh failure
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state) => {
        Object.assign(state, initialState);
        state.loading = false;
      });
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;
