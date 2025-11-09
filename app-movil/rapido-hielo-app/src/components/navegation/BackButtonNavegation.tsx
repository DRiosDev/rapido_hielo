import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

export const BackButtonNavegation = () => {
  return (
    <Pressable className="mr-3" onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color={Colors.black} />
    </Pressable>
  );
};
