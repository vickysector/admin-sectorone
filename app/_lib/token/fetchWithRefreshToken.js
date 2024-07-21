import { DeleteCookies } from "../helpers/DeleteCookies";
import { setStatusRefreshTokenExpired } from "../store/features/RefreshToken/RefreshTokenSlice";
import { getRefreshToken } from "./getRefreshToken";

export const fetchWithRefreshToken = async (
  fetchFunction,
  router,
  dispatch,
  ...args
) => {
  try {
    // await fetchFunction(...args);
    let success = await fetchFunction(...args);
    // console.log("succes breaches: ", success.status);
    if (success.status === 401 || success.status === 403) {
      throw success;
    }
  } catch (error) {
    // console.log("error breaches : ", error);
    if (error.status === 401 || error.status === 403) {
      try {
        // await getRefreshToken();
        // console.log("running inside refreshtoken ");
        // await fetchFunction(...args);
        let success = await getRefreshToken();

        // console.log("success refresh token: ", success);

        if (success.status !== 200) {
          throw new Error("");
        }

        let success_run_again = await fetchFunction(...args);
        // console.log(
        //   "running again... succes breaches: ",
        //   success_run_again.status
        // );
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Handle refresh token failure (e.g., logout, redirect to login)
        DeleteCookies();
        console.log("cookie deleted because refresh token is failed");
        dispatch(setStatusRefreshTokenExpired(true));
        setTimeout(() => {
          dispatch(setStatusRefreshTokenExpired(false));
          router.push("/auth/login");
          window.location.reload();
        }, 8000);
      }
    } else {
      //   console.error("Error fetching data:", error);

      DeleteCookies();
      // Handle other errors
      router.push("/auth/login");
      window.location.reload();
    }
  }
};
