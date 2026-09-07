import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Text, useColorScheme, View } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";

interface CustomTextInputProps extends TextInputProps {
  isPassword?: boolean;
  errorMessage?: any;
  backgroundColor?: string;
  rightIcon?: any;
}

export default function CustomTextInput({
  isPassword,
  errorMessage,
  backgroundColor,
  rightIcon = undefined,
  ...props
}: CustomTextInputProps) {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const defaultBg = isDark ? "#1e293b" : "#ffffff";
  const defaultTextColor = isDark ? "#ffffff" : Colors.textPrimary;
  const defaultPlaceholderColor = isDark ? "#94a3b8" : Colors.textPlaceholder;
  const defaultOutlineColor = isDark ? "#334155" : Colors.borderInputs;

  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput
        mode="outlined"
        outlineColor={defaultOutlineColor}
        activeOutlineColor={Colors.primary}
        outlineStyle={{ borderRadius: 14, borderWidth: 1.5 }}
        secureTextEntry={isPassword ? secureTextEntry : false}
        textColor={props.textColor || defaultTextColor}
        placeholderTextColor={props.placeholderTextColor || defaultPlaceholderColor}
        theme={{
          roundness: 14,
          colors: {
            onSurfaceVariant: isDark ? "#94a3b8" : Colors.textSecondary,
            text: defaultTextColor,
            placeholder: defaultPlaceholderColor,
            background: backgroundColor || defaultBg,
          },
        }}
        style={[{ backgroundColor: backgroundColor || defaultBg, fontSize: 15 }, props.style]}
        contentStyle={[{ height: 52 }, props.contentStyle]}
        {...props}
        right={
          isPassword ? (
            <TextInput.Icon
              icon={(iconProps) => (
                <Ionicons
                  name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={isDark ? "#94a3b8" : Colors.textSecondary}
                  {...iconProps}
                />
              )}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
              forceTextInputFocus={false}
            />
          ) : (
            rightIcon
          )
        }
      />

      {props?.error && !!errorMessage && (
        <Text className="mt-1 text-xs text-red-500 font-medium px-1">{errorMessage}</Text>
      )}
    </View>
  );
}
