import { Descriptions, message, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { getClient } from "../../../services/clients/api";
import { Client } from "../../../types/Client";
import { EmailWhatsappText } from "../EmailWhatsappText";
import { LoadingSection } from "../loadings/LoadingSeccion";
import { SinDatoBadget } from "../SinDatoBadget";

type ChildFunction = (id: string) => void;

export interface ModalShowOrderItemsRef {
  childFunction: ChildFunction;
}

type ModalShowOrderItemsProps = {};

export const ModalShowOrderItems = forwardRef<
  ModalShowOrderItemsRef,
  ModalShowOrderItemsProps
>((props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState<Client>();

  const [alert, setAlert] = useState({
    visible: false,
    description: "",
  });

  const childFunction: ChildFunction = async (id) => {
    setOpen(true);
    setAlert({ visible: false, description: "" });
    setIsLoadingData(true);

    try {
      const data = await getClient(id);
      setData(data);
    } catch (error: any) {
      console.log(error);
      messageApi.error("Ups, algo salió mal. Intenta nuevamente.");
      setOpen(false);
    } finally {
      setIsLoadingData(false);
    }
  };

  useImperativeHandle(ref, () => ({
    childFunction,
  }));

  return (
    <Modal
      title="Cliente"
      centered
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      {contextHolder}

      {/* loading */}
      <div className={`${isLoadingData ? "pt-5 flex" : "hidden"}`}>
        <LoadingSection />
      </div>

      {!isLoadingData && (
        <Descriptions column={1} layout="vertical">
          <Descriptions.Item label="RUT">{data?.rut}</Descriptions.Item>
          <Descriptions.Item label="Nombre">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Apellido">
            {data?.lastname}
          </Descriptions.Item>
          <Descriptions.Item label="Correo electrónico">
            {data?.email ? (
              <EmailWhatsappText value={data.email} type="email" />
            ) : (
              <SinDatoBadget text="correo electrónico" />
            )}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Teléfono">
              {data?.phone ? (
                <EmailWhatsappText value={data.phone} type="whatsapp" />
              ) : (
                <SinDatoBadget text="teléfono" />
              )}
            </Descriptions.Item> */}
          <Descriptions.Item label="Dirección">
            {data?.address ? data.address : <SinDatoBadget text="Dirección" />}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
});
