import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { useRefreshTokenMutation, useMeQuery } from "@/rtk/api/authApi";
import { setAuth, setLoading } from "@/rtk/features/authSlice";

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

  const initializeAuth = useCallback(async () => {
    if (initializedRef.current || loading !== "idle") return;

    dispatch(setLoading("pending"));

    try {
      // If accessToken but no user, fetch user data
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
      } else if (!accessToken) {
        await refreshToken().unwrap();
      }
    } catch (error) {
      console.log("Auth init failed:", error);
    } finally {
      dispatch(setLoading("succeeded"));
      initializedRef.current = true;
    }
  }, [accessToken, user, loading, dispatch, refreshToken, refetchMe]);

  // Initialize auth only once
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading: loading === "pending",
    role: user?.role,
  };
};
