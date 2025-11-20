import { Alert, Button, message, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { axiosInstance } from "../../../axios/axiosInstance";
import { BASE_URL_FILES } from "../../../constants/BaseURL";
import { LoadingSection } from "../loadings/LoadingSeccion";

type ChildFunction = (id: string) => void;

export interface ModalViewVaucherRef {
  childFunction: ChildFunction;
}

export interface ModalViewVaucherProps {}

export const ModalViewVaucher = forwardRef<
  ModalViewVaucherRef,
  ModalViewVaucherProps
>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [alert, setAlert] = useState({
    visible: false,
    description: "",
  });

  const childFunction: ChildFunction = async (id) => {
    setOpen(true);
    setIsLoadingData(true);
    setImageUrl(null);

    try {
      const { data } = await axiosInstance.get(`/api/orders/vaucher/${id}`);

      if (!data?.order?.vaucher) {
        setAlert({ visible: true, description: "No hay imagen disponible." });
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
            src={imageUrl}
            alt="voucher"
            style={{ width: "100%", borderRadius: 8, marginTop: 10 }}
          />
          <Button onClick={() => console.log("pagado")}>Confirmar pago</Button>
        </>
      )}

      {!isLoadingData && !imageUrl && alert.visible && (
        <Alert
          message="Error"
          description={alert.description}
          type="error"
          showIcon
        />
      )}
    </Modal>
  );
});
