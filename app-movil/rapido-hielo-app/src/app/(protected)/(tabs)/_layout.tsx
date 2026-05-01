import { useAuthUser } from "@/store/useAuthUser";
import { useCartStore } from "@/store/useCarts";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function _layout() {
  const { userLogged } = useAuthUser();
  const { itemCount, fetchCartItemCount } = useCartStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (userLogged?.id) {
      fetchCartItemCount(userLogged.id);
    }
  }, [userLogged]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff", // slate-900 o blanco
          borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
        },
        tabBarActiveTintColor: isDark ? "#3b82f6" : "#2563eb",
        tabBarInactiveTintColor: isDark ? "#64748b" : "#64748b",
        headerStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
        },
        headerTintColor: isDark ? "#ffffff" : "#000000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: (props) => (
            <Text className="text-3xl font-bold text-black dark:text-white">Productos</Text>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("../(modals)/(cart)/modal-cart")}
            >
              <View className="mr-4">
                <Ionicons name="cart-outline" size={28} color={isDark ? "white" : "black"} />
                {itemCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -4,
                      backgroundColor: "red",
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {itemCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Perfil",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: (props) => (
            <Text className="text-3xl font-bold text-black dark:text-white">{props.children}</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
