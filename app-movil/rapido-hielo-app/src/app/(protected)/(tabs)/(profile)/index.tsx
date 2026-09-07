import { axiosInstance } from "@/axios/axiosInstance";
import CustomButton from "@/components/ui/design/CustomButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Colors } from "@/constants/Colors";
import { VERSION } from "@/constants/Version";
import { useAuthUser } from "@/store/useAuthUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

export default function Profile() {
  const { userLogged, logout } = useAuthUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  const actions = [
    {
      title: "Mis compras",
      icon: <Ionicons name="bag-handle-outline" size={20} color={Colors.primary} />,
      onPress: () => router.push("/(protected)/(orders)"),
    },
    {
      title: "Configuración",
      icon: <Ionicons name="settings-outline" size={20} color={Colors.primary} />,
      onPress: () => router.push("/(protected)/(settings)"),
    },
    {
      title: "Cerrar sesión",
      titleClass: "text-red-500 font-semibold",
      icon: <Ionicons name="log-out-outline" size={20} color={Colors.redError} />,
      bgIcon: "bg-red-50 dark:bg-red-900/30",
      onPress: handleLogout,
    },
  ];

  const firstName = userLogged?.name || "";
  const lastName = userLogged?.lastname || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Usuario";

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <View className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
        <View className="items-center p-6 bg-white dark:bg-slate-800 rounded-3xl mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <Avatar.Text
            size={90}
            label={initials}
            style={{ backgroundColor: Colors.primary, marginBottom: 16 }}
            labelStyle={{ fontSize: 32, fontWeight: "bold", color: "white" }}
          />
          <Text className="text-2xl font-bold text-center" style={{ color: Colors.textPrimary }}>
            {fullName}
          </Text>
          <Text className="text-sm font-medium text-center mt-0.5 mb-5" style={{ color: Colors.textSecondary }}>
            {userLogged?.email || ""}
          </Text>

          <CustomButton
            onPress={() => router.push("../(modals)/(account)/modal-u-account")}
            style={{ backgroundColor: Colors.primary }}
          >
            Editar perfil
          </CustomButton>
        </View>

        <View className="flex-1 justify-between">
          <View className="bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-100 dark:border-slate-700 shadow-sm">
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-50 dark:active:bg-slate-700/50"
                style={{
                  borderBottomWidth: index < actions.length - 1 ? 1 : 0,
                  borderBottomColor: "#F1F5F9",
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`p-2.5 rounded-xl ${action.bgIcon || ""}`}
                    style={{ backgroundColor: action.bgIcon ? undefined : Colors.primarySoft }}
                  >
                    {action.icon}
                  </View>
                  <Text
                    className={`text-base font-bold ${action.titleClass || ""}`}
                    style={{ color: action.titleClass ? undefined : Colors.textPrimary }}
                  >
                    {action.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-xs font-semibold text-center py-4" style={{ color: Colors.textSecondary }}>
            Versión {VERSION}
          </Text>
        </View>
      </View>
    </>
  );
}
