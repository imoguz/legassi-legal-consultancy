import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export function getRoleFromToken(accessToken) {
  const token = accessToken || Cookies.get("icaAccessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded?.role || null;
  } catch (err) {
    console.error("Invalid JWT:", err);
    return null;
  }
}
