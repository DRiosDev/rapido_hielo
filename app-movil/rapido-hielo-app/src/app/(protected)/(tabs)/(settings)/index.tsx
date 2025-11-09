import { axiosInstance } from "@/axios/axiosInstance";
import CustomButton from "@/components/ui/design/CustomButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Colors } from "@/constants/Colors";
import { VERSION } from "@/constants/Version";
import { useAuthUser } from "@/store/useAuthUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { userLogged, logout } = useAuthUser();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Solo si hay token válido
      await axiosInstance.post("/api/logout");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      logout();
    }
  };

  // Configuración de las acciones
  // Configuración de acciones
  const actions = [
    {
      title: "Mi cuenta",
      icon: <Ionicons name="person-outline" size={19} color="black" />,
      onPress: () => router.push("../(modals)/(account)/modal-u-account"),
    },
    {
      title: "Cambiar contraseña",
      icon: <Ionicons name="lock-closed-outline" size={19} color="black" />,
      onPress: () => router.push("../(modals)/(account)/modal-u-password"),
    },
    {
      title: "Cerrar sesión",
      titleClass: "text-red-500",
      icon: <Ionicons name="log-out-outline" size={19} color="red" />,
      onPress: handleLogout,
    },
  ];

  return (
    <>
      {isLoading && <LoadingOverlay />}


      <View className="flex-1 p-6 bg-white">
        <View className="items-center gap-5">
          <Avatar.Text
            size={110}
            label={userLogged?.name[0] + userLogged?.lastname[0]}
          />
          <View className="items-center gap-1">
            <Text className="text-2xl font-semibold">
              {userLogged?.name + " " + userLogged?.lastname}
            </Text>
            <Text className="text-base font-medium text-center text-text-secondary">
              {userLogged?.email}
            </Text>
          </View>

          <CustomButton
            style={{ marginBottom: 20 }}
            onPress={() => router.push("../(modals)/(account)/modal-u-account")}
          >
            Editar cuenta
          </CustomButton>
        </View>

        <View className="items-center justify-between flex-1 w-full pt-5">
          <View className="w-full">
            {actions.map((action, index) => (
              <List.Item
                key={index}
                title={
                  <Text className={`font-semibold ${action.titleClass ?? ""}`}>
                    {action.title}
                  </Text>
                }
                style={styles.list_item}
                rippleColor="transparent"
                left={() => (
                  <View className="p-3 rounded-full bg-badge-gray">
                    {action.icon}
                  </View>
                )}
                right={() => (
                  <View className="pt-3">
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.black}
                    />
                  </View>
                )}
                onPress={action.onPress}
              />
            ))}
          </View>

          <Text className="text-base font-regular text-text-secondary">
            Version: {VERSION}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  list_item: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F6",
    width: "100%",
    paddingVertical: 12,
  },
});
