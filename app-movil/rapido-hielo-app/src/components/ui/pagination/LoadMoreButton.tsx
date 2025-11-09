import React from "react";
import { Text, View } from "react-native";
import CustomButton from "../design/CustomButton";

interface LoadMoreButtonProps {
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  onPress: () => void;
  noMoreMessage?: string;
  label?: string;
}

export default function LoadMoreButton(props: LoadMoreButtonProps) {
  const {
    hasNextPage,
    isLoading,
    onPress,
    noMoreMessage = "No hay más resultados",
    label = "Cargar más",
  } = props;

  if (!hasNextPage) {
    return (
      <Text className="py-3 text-center text-text-secondary">
        {noMoreMessage}
      </Text>
    );
  }

  return (
    <View className="mb-5 max-w-[200px] mx-auto">
      <CustomButton onPress={onPress} disabled={isLoading}>
        {isLoading ? "Cargando..." : label}
      </CustomButton>
    </View>
  );
}
