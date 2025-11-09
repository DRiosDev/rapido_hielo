import { useEffect } from "react";
import { useAuthUser } from "../store/useAuthUser";
import * as SecureStore from "expo-secure-store";

const useInitialData = () => {
  const { getMe } = useAuthUser();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) getMe();
    };

    checkToken();
  }, []);
};

export default useInitialData;
