import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Form, Input, message, Modal, Switch, Table, Popconfirm } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DeliverySlot } from "../../../types/DeliverySlot";
import {
  createDeliverySlot,
  deleteDeliverySlot,
  getDeliverySlots,
  updateDeliverySlot,
} from "../../../services/dispatches/api";

export interface ModalDeliverySlotsRef {
  openModal: () => void;
}

export const ModalDeliverySlots = forwardRef<ModalDeliverySlotsRef, {}>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [form] = Form.useForm();

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await getDeliverySlots();
      setSlots(data);
    } catch (error) {
      message.error("Error al cargar los rangos horarios.");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setOpen(true);
      fetchSlots();
    },
  }));

  const handleCreate = async (values: { slot: string }) => {
    try {
      await createDeliverySlot(values.slot);
      message.success("Rango horario creado correctamente.");
      form.resetFields();
      fetchSlots();
    } catch (error) {
      message.error("Error al crear el rango horario.");
    }
  };

  const handleToggleStatus = async (record: DeliverySlot) => {
    const newStatus = record.status === "active" ? "inactive" : "active";
    try {
      await updateDeliverySlot(record.id, { status: newStatus });
      message.success(`Estado actualizado a ${newStatus === 'active' ? 'Activo' : 'Inactivo'}`);
      fetchSlots();
    } catch (error) {
      message.error("Error al actualizar estado.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeliverySlot(id);
      message.success("Rango horario eliminado.");
      fetchSlots();
    } catch (error) {
      message.error("Error al eliminar el rango horario.");
    }
  };

  const columns = [
    {
      title: "Rango Horario",
      dataIndex: "slot",
      key: "slot",
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: DeliverySlot) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={status === "active"}
            onChange={() => handleToggleStatus(record)}
            size="small"
          />
          <span className={status === "active" ? "text-green-600 font-medium" : "text-gray-400"}>
            {status === "active" ? "Activo" : "Inactivo"}
          </span>
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 80,
      render: (_: any, record: DeliverySlot) => (
        <Popconfirm
          title="¿Eliminar este rango horario?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sí, eliminar"
          cancelText="Cancelar"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Gestión de Rangos Horarios de Despacho</span>}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={600}
      destroyOnClose
    >
      <div className="py-4">
        <Form form={form} onFinish={handleCreate} layout="inline" className="mb-6 flex gap-2">
          <Form.Item
            name="slot"
            rules={[{ required: true, message: "Ingrese el rango horario (ej. 09:00 - 12:00)" }]}
            className="flex-1"
          >
            <Input placeholder="Ej. 09:00 - 12:00" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Agregar
            </Button>
          </Form.Item>
        </Form>

        <Table
          dataSource={slots}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </div>
    </Modal>
  );
});
