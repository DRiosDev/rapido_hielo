import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export default function _layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: (props) => (
            <Text className="text-3xl font-bold">{props.children}</Text>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("../(modals)/(users)/modal-cu-user")}
              style={{ paddingRight: 15 }}
            >
              <Ionicons name="add-outline" size={24} color="black" />
            </Pressable>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerTitle: (props) => (
            <Text className="text-3xl font-bold">Producto</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
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
