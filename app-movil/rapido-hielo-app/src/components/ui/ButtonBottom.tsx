import * as React from "react";
import { View } from "react-native";
import { ButtonProps } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "./design/CustomButton";

export default function ButtonBottom(props: ButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 15,
      }}
    >
      <CustomButton {...props}>{props.children}</CustomButton>
    </View>
  );
}
