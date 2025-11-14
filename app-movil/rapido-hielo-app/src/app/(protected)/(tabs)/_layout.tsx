import { useAuthUser } from "@/store/useAuthUser";
import { useCartStore } from "@/store/useCarts";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function _layout() {
  const { userLogged } = useAuthUser();
  const { itemCount, fetchCartItemCount } = useCartStore();

  useEffect(() => {
    if (userLogged?.id) {
      fetchCartItemCount(userLogged.id);
    }
  }, [userLogged]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: (props) => (
            <Text className="text-3xl font-bold">Productos</Text>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("../(modals)/(cart)/modal-cart")}
            >
              <View className="mr-4">
                <Ionicons name="cart-outline" size={28} color="black" />
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
        name="(settings)"
        options={{
          title: "Configuración",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: (props) => (
            <Text className="text-3xl font-bold">{props.children}</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
