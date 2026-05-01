import { BackButtonNavegation } from "@/components/navegation/BackButtonNavegation";
import { VERSION } from "@/constants/Version";
import { Stack } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sobre Nosotros",
          headerShadowVisible: false,
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView className="flex-1 px-6 pt-8">
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-primary rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">RH</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">Rápido Hielo</Text>
            <Text className="text-gray-500 font-medium">Versión {VERSION}</Text>
          </View>

          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold mb-3 text-gray-800">
              ¿Quiénes Somos?
            </Text>
            <Text className="text-gray-600 leading-6 mb-4">
              Rápido Hielo es tu solución confiable y veloz para la distribución de hielo. 
              Nos aseguramos de que nunca te falte hielo para tus eventos, negocios o reuniones, 
              entregando siempre con la mejor calidad y puntualidad.
            </Text>

            <Text className="text-lg font-semibold mb-3 text-gray-800 mt-4">
              Contacto
            </Text>
            <Text className="text-gray-600 leading-6">
              Email: contacto@rapidohielo.com{"\n"}
              Teléfono: +56 9 1234 5678{"\n"}
              Santiago, Chile
            </Text>
          </View>

          <View className="items-center mt-10 mb-6">
            <Text className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Rápido Hielo. Todos los derechos reservados.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
