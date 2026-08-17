import { Alert, Button, Form, Input, InputNumber, message, Modal, Radio, Space } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useUpdateProductQuantity } from "../../../services/products/mutation";
import { Product } from "../../../types/Product";

export interface ModalUQuantityRef {
  childFunction: (id: string, product?: Product) => void;
}

type ModalUQuantityProps = {
  refetch?: () => void;
  onAddSuccess?: () => void;
};

export const ModalUQuantity = forwardRef<
  ModalUQuantityRef,
  ModalUQuantityProps
>((props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [alert, setAlert] = useState({
    visible: false,
    description: "",
  });

  const updateQuantityMutation = useUpdateProductQuantity();

  const childFunction = (id: string, prodData?: Product) => {
    setOpen(true);
    setAlert({ visible: false, description: "" });
    setIsLoadingButton(false);
    setId(id);
    setProduct(prodData || null);

    form.resetFields();
    form.setFieldsValue({
      action: prodData?.is_sack ? "subtract" : "add",
      quantity: 1,
      reason: "",
    });
  };

  useImperativeHandle(ref, () => ({
    childFunction,
  }));

  const handleError = (error: any) => {
    console.log(error);
    const errorMessage =
      error.response?.data?.message ||
      "Ups, algo salió mal. Intenta nuevamente.";
    setAlert({
      visible: true,
      description: errorMessage,
    });
    messageApi.error(errorMessage);
  };

  const changeStock = async () => {
    setIsLoadingButton(true);
    setAlert({
      visible: false,
      description: "",
    });

    const formValues = form.getFieldsValue();

    updateQuantityMutation.mutate(
      {
        id,
        action: formValues.action,
        quantity: Number(formValues.quantity),
        reason: formValues.reason,
      },
      {
        onSuccess: (data) => {
          messageApi.success(data.message || "Stock actualizado con éxito.");
          if (props?.refetch) {
            props.refetch();
          }
          if (props?.onAddSuccess) {
            props.onAddSuccess();
          }
          setOpen(false);
        },
        onError: handleError,
        onSettled: () => {
          setIsLoadingButton(false);
        },
      }
    );
  };

  return (
    <Modal
      title="Cambiar stock"
      centered
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      {contextHolder}

      {product?.is_sack && (
        <Alert
          type="warning"
          showIcon
          className="my-3"
          message="Producto Saco / Empacado"
          description="Para incrementar el stock de un saco debes usar la opción 'Empacar / Convertir Stock' para descontar la materia prima correspondiente. Aquí solo se permiten descuentos por mermas o pérdidas."
        />
      )}

      <Form
        form={form}
        className="pt-2"
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
        layout="vertical"
        onFinish={changeStock}
        initialValues={{ action: product?.is_sack ? "subtract" : "add", quantity: 1, reason: "" }}
      >
        <Form.Item
          name="action"
          label="Operación"
          rules={[{ required: true, message: "Seleccione un tipo de operación" }]}
        >
          <Radio.Group buttonStyle="solid" className="w-full grid grid-cols-2 gap-2">
            <Radio.Button
              value="add"
              disabled={Boolean(product?.is_sack)}
              className="text-center font-medium"
            >
              Aumento (+)
            </Radio.Button>
            <Radio.Button value="subtract" className="text-center font-medium">
              Descuento (-)
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Cantidad"
          rules={[
            { required: true, message: "Ingrese una cantidad válida" },
            { type: "number", min: 1, message: "La cantidad debe ser al menos 1" },
          ]}
        >
          <InputNumber
            min={1}
            step={1}
            precision={0}
            className="w-full"
            placeholder="Ingrese la cantidad"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Motivo / Observación (Opcional)"
          rules={[{ max: 255, message: "El motivo no puede exceder 255 caracteres" }]}
        >
          <Input placeholder="Ej: Merma por bolsa rota, Ajuste de inventario, etc." />
        </Form.Item>

        {/* Alert*/}
        {alert.visible && (
          <div className="mb-4">
            <Alert
              message="Error"
              description={alert.description}
              type="error"
              showIcon
            />
          </div>
        )}

        {/* Button */}
        <Form.Item className="flex justify-end p-0 m-0 mt-2">
          <Space size="middle">
            <Button danger type="text" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoadingButton}>
              Guardar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
});
