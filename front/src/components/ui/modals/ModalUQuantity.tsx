import { Alert, Button, Form, InputNumber, message, Modal, Radio, Space } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useUpdateProductQuantity } from "../../../services/products/mutation";

export interface ModalUQuantityRef {
  childFunction: (id: string) => void;
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
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const [alert, setAlert] = useState({
    visible: false,
    description: "",
  });

  const updateQuantityMutation = useUpdateProductQuantity();

  const childFunction = (id: string) => {
    setOpen(true);
    setAlert({ visible: false, description: "" });
    setIsLoadingButton(false);
    setId(id);

    form.resetFields();
    form.setFieldsValue({
      action: "add",
      quantity: 1,
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

      <Form
        form={form}
        className="pt-4"
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
        layout="vertical"
        onFinish={changeStock}
        initialValues={{ action: "add", quantity: 1 }}
      >
        <Form.Item
          name="action"
          label="Operación"
          rules={[{ required: true, message: "Seleccione un tipo de operación" }]}
        >
          <Radio.Group buttonStyle="solid" className="w-full grid grid-cols-2 gap-2">
            <Radio.Button value="add" className="text-center font-medium">
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
