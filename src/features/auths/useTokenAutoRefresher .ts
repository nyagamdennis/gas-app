import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { refreshAccessTokenIfExpired } from "./authSlice";



export const useTokenAutoRefresher = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleFocus = () => {
      console.log("👀 Tab focus detected");
      dispatch(refreshAccessTokenIfExpired());
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        console.log("👁️ Visibility change: active");
        dispatch(refreshAccessTokenIfExpired());
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dispatch]);
};
