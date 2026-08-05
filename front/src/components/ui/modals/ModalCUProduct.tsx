import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Modal,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../../../services/products/mutation";
import { Product } from "../../../types/Product";

export interface ModalCUProductRef {
  childFunction: (id?: string, data?: Product) => void; // Definimos el tipo con parámetros
}

type ModalCUProductProps = {
  refetch?: () => void;
  onAddSuccess?: () => void;
};

export const ModalCUProduct = forwardRef<
  ModalCUProductRef,
  ModalCUProductProps
>((props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const firstInputRef = useRef<InputRef | null>(null);

  const [form] = Form.useForm();

  const [alert, setAlert] = useState({
    visible: false,
    description: "",
  });

  const childFunction = (id?: string, data?: Product) => {
    setOpen(true);
    setAlert({ visible: false, description: "" });
    setIsLoadingButton(false);
    setIsEdit(false);
    form.resetFields();

    if (id && data) {
      //si viene id es edit
      setId(id);
      setIsEdit(true);

      form.setFieldsValue({
        name: data.name,
        description: data.description,
        weight: data.weight ? parseFloat(String(data.weight)) : undefined,
        price: data.price,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    childFunction,
  }));

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const handleError = (error: any) => {
    console.log(error);
    messageApi.error("Ups, algo salió mal. Intenta nuevamente.");
    if (error.response?.data?.errors?.email) {
      setAlert({
        visible: true,
        description: "El correo electrónico ya existe, intenta con otro",
      });
    }
  };

  const create = async () => {
    setIsLoadingButton(true);
    setAlert({
      visible: false,
      description: "",
    });

    const formValues = form.getFieldsValue();

    createProductMutation.mutate(formValues as Product, {
      onSuccess: (data) => {
        messageApi.success(data.message);

        if (props?.onAddSuccess) {
          props.onAddSuccess();
        }

        setOpen(false);
      },
      onError: handleError,
      onSettled: () => {
        setIsLoadingButton(false);
      },
    });
  };

  const update = async () => {
    setIsLoadingButton(true);
    setAlert({
      visible: false,
      description: "",
    });
    const formValues = form.getFieldsValue();

    formValues.id = id;
    formValues.key = id;

    updateProductMutation.mutate(formValues as Product, {
      onSuccess: (data) => {
        messageApi.success(data.message);
        if (props?.refetch) {
          props.refetch();
        }
        setOpen(false);
      },
      onError: handleError,
      onSettled: () => {
        setIsLoadingButton(false);
      },
    });
  };

  return (
    <Modal
      title={isEdit ? "Editar" : "Agregar"}
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
        onFinish={isEdit ? update : create}
      >
        {/* Name*/}
        <Form.Item
          name="name"
          validateTrigger="onBlur"
          label="Nombre"
          rules={[{ required: true, max: 20, whitespace: true, min: 2 }]}
        >
          <Input placeholder="Ingresa nombre" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-2">
          {/* Peso */}
          <Form.Item name="weight" validateTrigger="onBlur" label="Peso (Kg)">
            <InputNumber
              type="text"
              maxLength={8}
              className="w-full"
              controls={false}
              inputMode="numeric"
              placeholder="Ingresa peso"
              max="99999999"
              precision={1}
              min={"0.0"}
              step={"0.0"}
              formatter={(value) =>
                `${value}`
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  .replace(/\./g, (match, offset, fullStr) => {
                    return fullStr.length - offset > 3 ? "." : ",";
                  })
              }
              parser={(value: any) =>
                value?.replace(/\$\s?|\./g, "").replace(/,/g, ".")
              }
            />
          </Form.Item>

          {/* Precio */}
          <Form.Item
            name="price"
            validateTrigger="onBlur"
            label="Precio"
            rules={[{ required: true }]}
          >
            <InputNumber
              addonBefore="$"
              type="text"
              min="1"
              max="99999999"
              controls={false}
              className="w-full"
              maxLength={10}
              formatter={(value) =>
                `${value}`
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  .replace(/\./g, (match, offset, fullStr) => {
                    return fullStr.length - offset > 3 ? "." : ",";
                  })
              }
              parser={(value: any) =>
                value?.replace(/\$\s?|\./g, "").replace(/,/g, ".")
              }
              placeholder="Ingresa precio"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          validateTrigger="onBlur"
          label="Descripción"
          rules={[{ min: 4, max: 100, whitespace: true }]}
        >
          <TextArea placeholder="Ingresa descripción" />
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
