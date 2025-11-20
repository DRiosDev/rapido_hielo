import { message, Modal, Table } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { LoadingSection } from "../loadings/LoadingSeccion";
import { Product } from "../../../types/Product";
import { formatPrice } from "../../../helpers/formatPrice";
import { ColumnsType } from "antd/es/table";

type ChildFunction = (items: Product[]) => void;

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

  const [data, setData] = useState<Product[]>([]);

  const childFunction: ChildFunction = async (items) => {
    setOpen(true);
    setData(items);
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
