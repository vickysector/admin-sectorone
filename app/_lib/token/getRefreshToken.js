import { APIKEY } from "../helpers/APIKEYS";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";

export const getRefreshToken = async () => {
  try {
    const res = await fetch(`${APIKEY}refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: "app_secret!!!",
      },
    });

    // console.log("refresh token res: ", res);

    if (res.status === 401 || res.status === 403 || res.status === 400) {
      //   setSessionExpired(true);
      //   setTimeout(() => {
      //     setSessionExpired(false);
      //     DeleteCookies();
      //     router.push("/auth/login");
      //   }, 7000);
      return res;
    }

    const data = await res.json();

    deleteCookie("access_token");
    setCookie("access_token", data.data.access_token);

    // console.log("refresh token data: ", data);

    return res;
  } catch (error) {
  } finally {
  }
};
