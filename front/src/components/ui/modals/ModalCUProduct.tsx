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
  Switch,
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
  const isSack = Form.useWatch("is_sack", form);

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
        quantity: data.quantity ?? 0,
        min_stock: data.min_stock ?? 0,
        is_limited: Boolean(data.is_limited),
        is_sack: Boolean(data.is_sack),
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

  const create = async (values: any) => {
    setIsLoadingButton(true);
    setAlert({
      visible: false,
      description: "",
    });

    const payload = {
      ...values,
      is_limited: Boolean(values.is_limited),
      is_sack: Boolean(values.is_sack),
    };

    createProductMutation.mutate(payload as Product, {
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

  const update = async (values: any) => {
    setIsLoadingButton(true);
    setAlert({
      visible: false,
      description: "",
    });

    const payload = {
      ...values,
      id,
      key: id,
      is_limited: Boolean(values.is_limited),
      is_sack: Boolean(values.is_sack),
    };

    updateProductMutation.mutate(payload as Product, {
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
        initialValues={{ is_limited: false, is_sack: false, quantity: 0, min_stock: 0 }}
        className="pt-4"
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
        layout="vertical"
        onFinish={isEdit ? update : create}
      >
        {/* Es Saco / Producto Empacado */}
        <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200/80 mb-3 flex items-center justify-between gap-x-3">
          <div className="pr-2">
            <span className="font-semibold text-slate-800 text-sm block">
              Es Saco / Producto Empacado
            </span>
            <span className="text-xs text-slate-500 block leading-tight mt-0.5">
              Marca este producto si es un saco o pack armado desde formato base. Inicia en 0 y su stock aumenta al empacar/convertir.
            </span>
          </div>
          <Form.Item name="is_sack" valuePropName="checked" noStyle>
            <Switch
              className="bg-slate-300"
              onChange={(checked) => {
                if (checked && !isEdit) {
                  form.setFieldValue("quantity", 0);
                }
              }}
            />
          </Form.Item>
        </div>

        {/* Producto oferta y stock limitado */}
        <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/80 mb-4 flex items-center justify-between gap-x-3">
          <div className="pr-2">
            <span className="font-semibold text-slate-800 text-sm block">
              Producto de oferta limitada / stock limitado
            </span>
            <span className="text-xs text-slate-500 block leading-tight mt-0.5">
              Marca este producto si es especial u oferta temporal (ej. vinos, bebidas) con stock finito sin reposición continua.
            </span>
          </div>
          <Form.Item name="is_limited" valuePropName="checked" noStyle>
            <Switch className="bg-slate-300" />
          </Form.Item>
        </div>

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

        <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-2">
          {/* Stock Inicial */}
          <Form.Item
            name="quantity"
            validateTrigger="onBlur"
            label="Stock Inicial"
            tooltip={
              isSack
                ? "Los sacos inician con stock 0 y su inventario se incrementa al empacar o convertir producto base."
                : isEdit
                ? "El stock no se puede modificar al editar el producto. Utiliza la opción de actualizar stock o empacar."
                : "Define la cantidad de unidades iniciales al crear el producto (0 a X)."
            }
            rules={[{ required: !isEdit && !isSack, message: "Ingresa el stock inicial" }]}
          >
            <InputNumber
              type="number"
              min={0}
              max={999999}
              disabled={isEdit || isSack}
              className="w-full"
              placeholder={isSack ? "0 (Se incrementa al empacar)" : "Ej: 10"}
            />
          </Form.Item>

          {/* Stock Mínimo */}
          <Form.Item
            name="min_stock"
            validateTrigger="onBlur"
            label="Stock Mínimo (Alerta)"
            tooltip="Define la cantidad mínima en inventario para disparar la alerta de bajo stock. (0 desactiva la alerta)"
          >
            <InputNumber
              type="number"
              min={0}
              max={999999}
              className="w-full"
              placeholder="Ej: 50 (0 para desactivar)"
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
