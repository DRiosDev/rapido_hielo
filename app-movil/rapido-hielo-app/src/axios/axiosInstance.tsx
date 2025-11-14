import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert, Linking } from "react-native";
import { useAuthUser } from "../store/useAuthUser";

//LOCAL
export const baseURL = "https://d1f58098de45.ngrok-free.app";

//DEV
/* export const baseURL = "https://apidevpos.vortexpos.com";  */

//DEMO
/* export const baseURL = "https://apidemopos.vortexpos.com"; */

//PRODUCCION
/* export const baseURL = "https://api.vortexpos.com"; */

async function getAccessToken() {
  return SecureStore.getItem("token");
}

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Añadir el token en cada peticion
axiosInstance.interceptors.request.use(
  async (req) => {
    const access_token = await getAccessToken();

    if (access_token) {
      req.headers["Authorization"] = "Bearer " + access_token;
    }

    req.params = req.params || {};

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const error_message = error?.response?.data?.error;

    // Si el token expiró y aún no hemos reintentado esta petición
    if (error_message === "token_expired" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Llamamos al endpoint de refresh
        const { data } = await axiosInstance.post("/api/auth/refresh");

        await SecureStore.setItemAsync("token", data.access_token); // Guardamos el nuevo token

        // Actualizamos la petición original con el nuevo token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`;

        // Reintentamos la petición original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);

        Alert.alert(
          "Sesión expirada",
          "Por seguridad, tu sesión ha expirado. Por favor, vuelve a iniciar sesión.",
          [{ text: "Cancelar", style: "cancel" }],
          { cancelable: true }
        );

        useAuthUser.getState().logout();
        return Promise.reject(refreshError);
      }
    } else if (
      error_message === "Tu cuenta está desactivada. Acceso denegado."
    ) {
      Alert.alert(
        "Tu cuenta está desactivada. Acceso denegado.",
        "Serás redirigido al login.",
        [{ text: "Cancelar", style: "cancel" }],
        { cancelable: true }
      );
    } else if (error?.response?.status === 500) {
      const extraMessage =
        typeof error?.response?.data?.message === "string"
          ? ` (${error?.response?.data?.message})`
          : "";

      console.log("llega esto " + error.response.data.message);

      Alert.alert(
        "Error del servidor",
        "Algo salió mal, intenta de nuevo o contacta a soporte.\n" +
          "Error: " +
          extraMessage,
        [
          {
            text: "Contactar Soporte",
            onPress: () => Linking.openURL("mailto:desarrollo@grupovortex.cl"),
          },
          { text: "Cancelar", style: "cancel" },
        ],
        { cancelable: true }
      );
    }

    return Promise.reject(error);
  }
);
