import { useNetwork } from "@/context/NetworkContext";
import { useEffect } from "react";
import { hideMessage, showMessage } from "react-native-flash-message";

export default function OfflineNotice() {
  const { isConnected } = useNetwork();

  useEffect(() => {
    if (!isConnected) {
      showMessage({
        message: "Sin conexión a internet",
        description: "Algunas funciones pueden no estar disponibles.",
        type: "danger",
        icon: "warning",
        duration: 0, // Fijo hasta que haya conexión
      });
    } else {
      hideMessage(); // Cierra el toast cuando vuelve la conexión
    }
  }, [isConnected]);

  // Si quieres además mostrar una vista visual adicional:
  if (isConnected) return null;

  return null;
}
