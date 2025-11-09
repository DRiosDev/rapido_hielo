import { Colors } from "@/constants/Colors";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Portal } from "react-native-paper";

export default function LoadingOverlay() {
  return (
    <Portal>
      <View className="absolute inset-0 z-0 items-center justify-center bg-black/30">
        <View className="px-5 py-5 bg-white rounded-lg">
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      </View>
    </Portal>
  );
}
