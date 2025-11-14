import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
    </Stack>
  );
}
