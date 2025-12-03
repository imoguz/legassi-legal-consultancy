import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export function getAuthVerifyFromToken(token) {
  const accessToken = token || Cookies.get('icaAccessToken');
  if (!accessToken) return false;

  try {
    const { exp } = jwtDecode(accessToken);
    const now = Date.now() / 1000;
    return exp > now;
  } catch {
    return false;
  }
}
