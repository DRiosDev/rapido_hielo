import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Text, View } from "react-native";
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
  backgroundColor = "white",
  rightIcon = undefined,
  ...props
}: CustomTextInputProps) {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput
        mode="outlined"
        outlineColor="#EEEFF0"
        outlineStyle={{ borderWidth: 1 }}
        secureTextEntry={isPassword ? secureTextEntry : false}
        theme={{ roundness: 15 }}
        style={{ backgroundColor: backgroundColor }}
        contentStyle={{ height: 52 }}
        {...props}
        right={
          isPassword ? (
            <TextInput.Icon
              icon={(iconProps) => (
                <Ionicons
                  name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                  size={20}
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
        <Text className="mt-1 text-red-500">{errorMessage}</Text>
      )}
    </View>
  );
}
