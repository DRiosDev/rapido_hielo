import { Colors } from "@/constants/Colors";
import * as React from "react";
import { Animated, Pressable } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

export default function CustomButton({
  mode = "contained",
  style,
  onPress,
  ...props
}: ButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, { width: "100%" }]}>
      <Button
        mode={mode}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          {
            width: "100%",
            borderRadius: 14,
            borderColor: mode === "outlined" ? Colors.primary : "transparent",
            elevation: mode === "contained" ? 2 : 0,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: mode === "contained" ? 0.2 : 0,
            shadowRadius: 8,
          },
          style,
        ]}
        contentStyle={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        labelStyle={{ fontSize: 16, fontWeight: "600", letterSpacing: 0.2 }}
        {...props}
      />
    </Animated.View>
  );
}
