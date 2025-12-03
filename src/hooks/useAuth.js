import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useRefreshTokenMutation, useMeQuery } from "@/rtk/api/authApi";
import { setAuth, setLoading } from "@/rtk/features/authSlice";

let authInitialized = false; // Global flag

export const useAuth = () => {
  const dispatch = useDispatch();
  const { accessToken, user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  const [refreshToken] = useRefreshTokenMutation();
  const { refetch: refetchMe } = useMeQuery(undefined, {
    skip: !accessToken,
  });
  const initializedRef = useRef(false);

  // Initialize auth only once
  useEffect(() => {
    if (initializedRef.current || authInitialized) return;

    const initializeAuth = async () => {
      if (loading !== "idle") return;

      dispatch(setLoading("pending"));

      try {
        // If we have accessToken but no user, fetch user data
        if (accessToken && !user) {
          const result = await refetchMe();
          if (result.data) {
            dispatch(
              setAuth({
                accessToken,
                user: result.data.user,
              })
            );
          }
        }
        // If no accessToken, try to refresh
        else if (!accessToken) {
          const result = await refreshToken().unwrap();
          dispatch(setAuth(result));
        }
      } catch (error) {
        console.log("Auth init failed:", error);
        // Don't dispatch anything, let middleware handle redirect
      } finally {
        dispatch(setLoading("succeeded"));
        initializedRef.current = true;
        authInitialized = true;
      }
    };

    initializeAuth();
  }, [accessToken, user, loading, dispatch, refreshToken, refetchMe]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading: loading === "pending",
    role: user?.role,
  };
};
