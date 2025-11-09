import { Colors } from "@/constants/Colors";
import * as React from "react";
import { Button, ButtonProps } from "react-native-paper";

export default function CustomButton({
  mode = "contained",
  style,
  ...props
}: ButtonProps) {
  return (
    <Button
      mode={mode}
      style={[
        {
          width: "100%",
          borderRadius: 10,
          borderColor: mode === "outlined" ? Colors.primary : "",
        },
        style, // <-- IMPORTANTE, aquí mezclas estilos externos
      ]}
      contentStyle={[
        {
          paddingVertical: 7,
          paddingHorizontal: 16,
        },
      ]}
      labelStyle={{ fontSize: 16, fontWeight: "600" }}
      {...props}
    />
  );
}
