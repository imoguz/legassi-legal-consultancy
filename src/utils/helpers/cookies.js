export const setCookie = (name, value, days = 15) => {
  if (typeof window === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

export const getCookie = (name) => {
  if (typeof window === "undefined") return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name) => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Refresh token helpers
export const setRefreshToken = (token) => {
  setCookie("refreshToken", token, 15);
};

export const getRefreshToken = () => {
  return getCookie("refreshToken");
};

export const removeRefreshToken = () => {
  deleteCookie("refreshToken");
};

// Logout helper
export const handleLogout = async (logoutMutation, dispatch) => {
  try {
    await logoutMutation().unwrap();
  } catch (error) {
    console.log("Logout error:", error);
  } finally {
    // Clear local state
    dispatch(clearAuth());
    // Remove cookies
    removeRefreshToken();

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
};
