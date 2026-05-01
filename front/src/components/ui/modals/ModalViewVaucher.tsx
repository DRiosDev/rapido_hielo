import { Alert, Button, message, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { axiosInstance } from "../../../axios/axiosInstance";
import { BASE_URL_FILES } from "../../../constants/BaseURL";
import { LoadingSection } from "../loadings/LoadingSeccion";

type ChildFunction = (id: string) => void;

export interface ModalViewVaucherRef {
  childFunction: ChildFunction;
}

export interface ModalViewVaucherProps {
  refetchData?: () => void;
}

export const ModalViewVaucher = forwardRef<
  ModalViewVaucherRef,
  ModalViewVaucherProps
>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [idOrder, setIdOrder] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
    visible: boolean;
    description: string;
    type: "error" | "info";
  }>({
    visible: false,
    description: "",
    type: "error",
  });

  const { refetchData } = props;

  const childFunction: ChildFunction = async (id) => {
    setOpen(true);
    setIsLoadingData(true);
    setImageUrl(null);
    setIdOrder(id);

    try {
      const { data } = await axiosInstance.get(`/api/orders/vaucher/${id}`);

      if (data?.order?.method_payment == 1) {
        setAlert({
          visible: true,
          description: "Esta orden tiene pago en tienda. No requiere comprobante de transferencia.",
          type: "info",
        });
        return;
      }

      if (!data?.order?.vaucher) {
        setAlert({
          visible: true,
          description: "No hay imagen disponible.",
          type: "error",
        });
        return;
      }

      const fullUrl = BASE_URL_FILES + data.order.vaucher;

      setImageUrl(fullUrl);
    } catch (e: any) {
      messageApi.error("Error al cargar la imagen");
    } finally {
      setIsLoadingData(false);
    }
  };

  useImperativeHandle(ref, () => ({
    childFunction,
  }));

  const confirmPayment = async (id: string) => {
    setIsLoadingData(true);

    try {
      await axiosInstance.put(`/api/orders/confirm-payment/${id}`);
      messageApi.success("Pago confirmado correctamente");
      refetchData?.();
      setOpen(false);
    } catch (error: any) {
      messageApi.error(
        error?.response?.data?.message || "Error al confirmar el pago"
      );
    }
  };

  return (
    <Modal
      title="Vaucher depósito"
      centered
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      {contextHolder}

      {isLoadingData && (
        <div className="pt-5 flex">
          <LoadingSection />
        </div>
      )}

      {!isLoadingData && imageUrl && (
        <>
          <img
            loading="lazy"
            src={imageUrl}
            alt="voucher"
            style={{ width: "100%", borderRadius: 8, marginTop: 10 }}
          />
          <Button onClick={() => confirmPayment(idOrder)}>
            Confirmar pago
          </Button>
        </>
      )}

      {!isLoadingData && !imageUrl && alert.visible && (
        <Alert
          message={alert.type === "info" ? "Información" : "Error"}
          description={alert.description}
          type={alert.type}
          showIcon
        />
      )}
    </Modal>
  );
});
