import { message, Modal, Table } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { LoadingSection } from "../loadings/LoadingSeccion";
import { Product } from "../../../types/Product";
import { formatPrice } from "../../../helpers/formatPrice";
import { ColumnsType } from "antd/es/table";
import { Order } from "../../../types/Order";
import { getOrderItems } from "../../../services/orders/api";

type ChildFunction = (id: Order["id"]) => void;

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

  const [data, setData] = useState<Product[]>([]);

  const childFunction: ChildFunction = async (id) => {
    setOpen(true);
    setIsLoadingData(true);

    try {
      const data = await getOrderItems(id);
      setData(data.data);
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

  // columnas simples
  const columns: ColumnsType<Partial<Product>> = [
    {
      title: "Producto",
      dataIndex: "name_product",
      key: "name_product",
    },
    {
      title: "Precio",
      dataIndex: "price_product",
      key: "price_product",
      render: (text: number) => <p>{formatPrice(text)}</p>,
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <Modal
      title="Productos de orden"
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
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
      )}
    </Modal>
  );
});
