import { Stack } from "expo-router";
import React from "react";

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(account)/modal-u-account" options={{ presentation: "modal" }} />
      <Stack.Screen name="(account)/modal-u-password" options={{ presentation: "modal" }} />
      <Stack.Screen name="(cart)/modal-cart" options={{ presentation: "modal" }} />
      <Stack.Screen name="(cart)/modal-confirm-payment" options={{ presentation: "modal" }} />
    </Stack>
  );
}
