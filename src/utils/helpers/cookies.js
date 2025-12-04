export const setCookie = (name, value, days = 15) => {
  if (typeof window === "undefined") return;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
};

export const getCookie = (name) => {
  if (typeof window === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
};

export const deleteCookie = (name) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Refresh token helpers
export const setRefreshToken = (token) => setCookie("refreshToken", token, 15);
export const getRefreshToken = () => getCookie("refreshToken");
export const removeRefreshToken = () => deleteCookie("refreshToken");

// Logout helper
export const handleLogout = async (logoutMutation, dispatch) => {
  try {
    await logoutMutation().unwrap();
  } catch (err) {
    console.error("Logout error:", err);
  }
  dispatch(clearAuth());
  removeRefreshToken();
  if (typeof window !== "undefined") window.location.href = "/auth/login";
};
