import { Form, Input, InputProps, Select } from "antd";

interface PhoneFormItemProps extends Omit<InputProps, "form"> {
  label?: string;
  name?: string;
  name_prefix?: string;
  required?: boolean;
}

export default function PhoneFormItem(props: PhoneFormItemProps) {
  const {
    label = "Teléfono",
    name = "phone",
    name_prefix = "phone_prefix",
    required = false,
    ...inputProps
  } = props;

  return (
    <Form.Item
      name={name}
      label={label}
      validateTrigger="onBlur"
      rules={[
        {
          required,
        },
        {
          min: 9,
          message: "Mínimo 9 números",
        },
        {
          pattern: new RegExp(/^[0-9]+$/),
          message: "Solo ingresa números por favor",
        },
      ]}
    >
      <Input
        maxLength={9}
        addonBefore={
          <Form.Item name={name_prefix} noStyle initialValue="+56">
            <Select>
              <Select.Option value="+56">+56</Select.Option>
            </Select>
          </Form.Item>
        }
        type="tel"
        placeholder="Ingresa teléfono"
        {...inputProps}
      />
    </Form.Item>
  );
}