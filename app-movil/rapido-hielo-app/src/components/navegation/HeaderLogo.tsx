// components/HeaderLogo.tsx
import LOGO from "@/constants/Logo";
import React from "react";
import { Image } from "react-native";
import { BackButtonNavegation } from "./BackButtonNavegation";

interface HeaderLogoProps {
  showBack?: boolean;
}

export default function HeaderLogo({ showBack = false }: HeaderLogoProps) {
  return {
    headerTitle: () => (
      <Image
        source={LOGO}
        style={{ width: 110, height: 40 }}
        resizeMode="contain"
      />
    ),
    headerShadowVisible: false,
    headerLeft: showBack ? () => <BackButtonNavegation /> : undefined,
  };
}
