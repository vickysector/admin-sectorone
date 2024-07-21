import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";

export function DeleteCookies() {
  deleteCookie("access_token");
  deleteCookie("email_credentials");
  deleteCookie("refresh_token");
  deleteCookie("user_identifier");
  deleteCookie("user_status");
  deleteCookie("scanned_user");
  deleteCookie("scanned_email");
  deleteCookie("scanned_verified");
}
