import { Colors } from "@/constants/Colors";
import { useAuthUser } from "@/store/useAuthUser";
import { useCartStore } from "@/store/useCarts";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

export default function _layout() {
  const { userLogged } = useAuthUser();
  const { itemCount, fetchCartItemCount } = useCartStore();
  const colorScheme = useColorScheme();
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
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: isDark ? "#ffffff" : Colors.textPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Productos",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: () => (
            <Text
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: isDark ? "#ffffff" : Colors.textPrimary }}
            >
              Productos
            </Text>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("../(modals)/(cart)/modal-cart")}
              className="mr-5 p-2 rounded-full active:bg-slate-100 dark:active:bg-slate-800"
            >
              <View className="relative">
                <Ionicons
                  name="cart-outline"
                  size={26}
                  color={isDark ? "white" : Colors.textPrimary}
                />
                {itemCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -8,
                      top: -6,
                      backgroundColor: Colors.primary,
                      borderRadius: 10,
                      minWidth: 18,
                      height: 18,
                      paddingHorizontal: 4,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1.5,
                      borderColor: isDark ? "#0f172a" : "#ffffff",
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
          tabBarIcon: ({ color, focused, size }) => (
            <View className={`p-1 rounded-xl ${focused ? "bg-indigo-50 dark:bg-slate-800" : ""}`}>
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                color={color}
                size={size}
              />
            </View>
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
            <Text
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: isDark ? "#ffffff" : Colors.textPrimary }}
            >
              Perfil
            </Text>
          ),
          tabBarIcon: ({ color, focused, size }) => (
            <View className={`p-1 rounded-xl ${focused ? "bg-indigo-50 dark:bg-slate-800" : ""}`}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={size}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
