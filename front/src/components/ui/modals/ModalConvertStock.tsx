import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import { Package, ArrowRight } from "lucide-react";
import { Product } from "../../../types/Product";
import { useConvertStock } from "../../../services/products/mutation";

export interface ModalConvertStockRef {
  openModal: (defaultOriginId?: string) => void;
}

interface ModalConvertStockProps {
  products: Product[];
  refetch?: () => void;
}

export const ModalConvertStock = forwardRef<
  ModalConvertStockRef,
  ModalConvertStockProps
>(({ products, refetch }, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const convertStockMutation = useConvertStock();

  // Watch form values for live calculation preview
  const originId = Form.useWatch("origin_product_id", form);
  const destinationId = Form.useWatch("destination_product_id", form);
  const factor = Form.useWatch("conversion_factor", form) || 1;
  const qtyToCreate = Form.useWatch("quantity_to_create", form) || 0;

  const originProduct = products.find((p) => p.id === originId);
  const destinationProduct = products.find((p) => p.id === destinationId);

  const totalOriginNeeded = factor * qtyToCreate;
  const isInsufficientStock =
    originProduct ? originProduct.quantity < totalOriginNeeded : false;

  const openModal = (defaultOriginId?: string) => {
    form.resetFields();
    if (defaultOriginId) {
      form.setFieldsValue({ origin_product_id: defaultOriginId });
    }
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  const handleSubmit = (values: any) => {
    if (isInsufficientStock) {
      messageApi.error("Stock insuficiente en el producto de origen.");
      return;
    }

    convertStockMutation.mutate(values, {
      onSuccess: (res) => {
        messageApi.success(res.message || "Conversión realizada con éxito.");
        setOpen(false);
        if (refetch) refetch();
      },
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.message || "Error al realizar la conversión de stock.";
        messageApi.error(errorMsg);
      },
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-800">
          <Package className="size-5 text-blue-600" />
          <span>Convertir / Empacar Stock</span>
        </div>
      }
      centered
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={540}
    >
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ conversion_factor: 5, quantity_to_create: 10 }}
        className="pt-3"
      >
        {/* Producto Origen (Bolsas) */}
        <Form.Item
          name="origin_product_id"
          label="Producto Origen (Bolsas)"
          rules={[{ required: true, message: "Selecciona el producto origen" }]}
        >
          <Select
            placeholder="Selecciona producto de origen"
            options={products.map((p) => ({
              label: `${p.name} — (Stock disponible: ${p.quantity})`,
              value: p.id,
            }))}
          />
        </Form.Item>

        {/* Producto Destino (Sacos) */}
        <Form.Item
          name="destination_product_id"
          label="Producto Destino (Sacos / Packs)"
          rules={[{ required: true, message: "Selecciona el producto destino" }]}
        >
          <Select
            placeholder="Selecciona producto destino a crear"
            options={products
              .filter((p) => p.id !== originId)
              .map((p) => ({
                label: `${p.name} — (Stock actual: ${p.quantity})`,
                value: p.id,
              }))}
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Factor de Conversión */}
          <Form.Item
            name="conversion_factor"
            label="Bolsas por cada 1 Saco"
            tooltip="Cuántas unidades del producto origen se necesitan para armar 1 unidad del producto destino"
            rules={[{ required: true, message: "Ingresa la equivalencia" }]}
          >
            <InputNumber
              min={1}
              max={999}
              className="w-full"
              placeholder="Ej: 5"
            />
          </Form.Item>

          {/* Cantidad a Crear */}
          <Form.Item
            name="quantity_to_create"
            label="Cantidad de Sacos a Armar"
            rules={[{ required: true, message: "Ingresa la cantidad a armar" }]}
          >
            <InputNumber
              min={1}
              max={999999}
              className="w-full"
              placeholder="Ej: 40"
            />
          </Form.Item>
        </div>

        {/* Motivo opcional */}
        <Form.Item name="reason" label="Observación / Motivo (Opcional)">
          <Input placeholder="Ej: Empaque de producción de la tarde" />
        </Form.Item>

        {/* Resumen dinámico de la operación */}
        {originProduct && destinationProduct && (
          <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Resumen de la conversión
            </h4>
            <div className="flex items-center justify-between text-sm">
              <div className="text-red-600 font-medium">
                -{totalOriginNeeded} {originProduct.name}
              </div>
              <ArrowRight className="size-4 text-slate-400" />
              <div className="text-emerald-600 font-medium">
                +{qtyToCreate} {destinationProduct.name}
              </div>
            </div>

            {isInsufficientStock && (
              <Alert
                className="mt-3"
                type="error"
                showIcon
                message="Stock insuficiente"
                description={`No hay suficientes unidades de ${originProduct.name}. Tienes ${originProduct.quantity} y necesitas ${totalOriginNeeded}.`}
              />
            )}
          </div>
        )}

        {/* Botones de acción */}
        <Form.Item className="flex justify-end m-0 pt-2">
          <Space size="middle">
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={convertStockMutation.isPending}
              disabled={isInsufficientStock}
              className="bg-blue-600"
            >
              Confirmar Conversión
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
});
