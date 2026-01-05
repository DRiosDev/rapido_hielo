import axios from "axios";
import { useAuthUser } from "../store/useAuthUser";
import { Colors } from "./../constants/Colors";
import { Modal } from "antd";

interface ShowModal {
  type?: "warning" | "error";
  title: string;
  content: React.ReactNode;
  onOk?: () => void;
}

//LOCAL
export const baseURL = "http://127.0.0.1:8000";

//DEV
/* export const baseURL = "https://apidevpos.vortexpos.com";  */

//DEMO
/* export const baseURL = "https://apidemopos.vortexpos.com"; */

//PRODUCCION
/* export const baseURL = "https://api.vortexpos.com"; */

async function getAccessToken() {
  return localStorage.getItem("token");
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
    const user_logged = useAuthUser.getState().userLogged?.role;

    if (access_token) {
      req.headers["Authorization"] = "Bearer " + access_token;
    }

    req.params = req.params || {};

    if (user_logged) {
      req.params.role_user_request = user_logged; // agrega el rol como parámetro
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function showModal({ type = "warning", title, content, onOk }: ShowModal) {
  const config = {
    title,
    content,
    keyboard: false,
    maskClosable: false,
    okButtonProps: {
      className: "!py-[10px]",
      style: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        color: "white",
      },
    },
    onOk,
  };

  if (type === "error") {
    Modal.error(config);
  } else {
    Modal.warning(config);
  }
}

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

        localStorage.setItem("token", data.access_token); // Guardamos el nuevo token

        // Actualizamos la petición original con el nuevo token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`;

        // Reintentamos la petición original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);

        showModal({
          title: "Sesión expirada",
          content:
            "Por seguridad, tu sesión ha expirado. Por favor, vuelve a iniciar sesión.",
        });

        useAuthUser.getState().logout();
        return Promise.reject(refreshError);
      }
    } else if (
      error_message === "Tu cuenta está desactivada. Acceso denegado."
    ) {
      showModal({
        title: "Tu cuenta está desactivada. Acceso denegado.",
        content: "Serás redirigido al login.",
        onOk: () => {
          useAuthUser.getState().logout();
        },
      });
    } else if (error?.response?.status === 500) {
      const extraMessage =
        typeof error?.response?.message === "string"
          ? ` (${error?.response?.message})`
          : "";

      showModal({
        type: "error",
        title: "Error del servidor",
        content: (
          <>
            Algo salió mal, intenta de nuevo o contacta a soporte.{" "}
            <a href="mailto:desarrollo@grupovortex.cl">
              desarrollo@grupovortex.cl
            </a>
            {extraMessage && (
              <>
                <br />
                <small className="text-text-secondary-500">
                  {extraMessage}
                </small>
              </>
            )}
          </>
        ),
      });
    }

    return Promise.reject(error);
  }
);
