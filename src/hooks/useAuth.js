import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { useRefreshTokenMutation, useMeQuery } from "@/rtk/api/authApi";
import { setAuth, setLoading } from "@/rtk/features/authSlice";
import { setRefreshToken } from "@/utils/helpers";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { accessToken, user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  const [refreshToken, { isLoading: isRefreshing }] = useRefreshTokenMutation();
  const { refetch: refetchMe, isLoading: isMeLoading } = useMeQuery(undefined, {
    skip: !accessToken,
  });
  const initializedRef = useRef(false);

  const initializeAuth = useCallback(async () => {
    if (initializedRef.current) return;

    dispatch(setLoading(true));

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
        // Refresh token from cookie
        const result = await refreshToken().unwrap();
        if (result.refreshToken) {
          setRefreshToken(result.refreshToken);
        }
      }
    } catch (error) {
      console.log("Auth init failed:", error);
    } finally {
      dispatch(setLoading(false));
      initializedRef.current = true;
    }
  }, [accessToken, user, dispatch, refreshToken, refetchMe]);

  // Initialize auth only once
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Combined loading state
  const isLoading = loading || isRefreshing || isMeLoading;

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    role: user?.role,
  };
};
