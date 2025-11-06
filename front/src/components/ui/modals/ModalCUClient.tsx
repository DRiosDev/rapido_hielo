import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Client } from "../../../types/Client";
import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import EmailFormItem from "../form/items/EmailFormItem";

export interface ModalCUClientRef {
  childFunction: (id?: string, data?: Client) => void; // Definimos el tipo con parámetros
}

type ModalCUClientProps = {
  refetch?: () => void;
  onAddSuccess?: () => void;
};

export const ModalCUClient = forwardRef<ModalCUClientRef, ModalCUClientProps>(
  (props, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>("");
    const [isEdit, setIsEdit] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();

    const [alert, setAlert] = useState({
      visible: false,
      description: "",
    });

    const childFunction = (id?: string, data?: Client) => {
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
          lastname: data.lastname,
          email: data.email,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      childFunction,
    }));

    const create = async () => {
      /*       setIsLoadingButton(true);
      setAlert({
        visible: false,
        description: "",
      });

      const formValues = form.getFieldsValue();

      createUserMutation.mutate(formValues as User, {
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
      }); */
    };

    const update = async () => {
      /*       setIsLoadingButton(true);
      setAlert({
        visible: false,
        description: "",
      });
      const formValues = form.getFieldsValue();

      formValues.id = id;
      formValues.key = id;

      updateUserMutation.mutate(formValues as User, {
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
      }); */
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
          {/* Name y Lastname */}
          <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-2">
            {/* Name */}
            <Form.Item
              name="name"
              validateTrigger="onBlur"
              label="Nombre"
              rules={[{ required: true, max: 20, whitespace: true, min: 2 }]}
            >
              <Input placeholder="Ingresa nombre" />
            </Form.Item>

            {/* Lastname */}
            <Form.Item
              name="lastname"
              validateTrigger="onBlur"
              label="Apellidos"
              rules={[{ required: true, min: 2, max: 20, whitespace: true }]}
            >
              <Input placeholder="Ingresa apellidos" />
            </Form.Item>
          </div>

          {/* email */}
          <EmailFormItem required={true} />

          {/* direccion */}

          <Form.Item
            name="address"
            label="Dirección"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                whitespace: true,
                min: 4,
                max: 100,
              },
            ]}
          >
            <Input placeholder="Ingresa dirección" />
          </Form.Item>

          <div className="mb-4">
            <Alert
              message="Importante"
              description="La contraseña sera enviada al cliente mediante correo electrónico"
              type="info"
              showIcon
            />
          </div>

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
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingButton}
              >
                Guardar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
