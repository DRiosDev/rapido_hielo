import { axiosInstance } from "@/axios/axiosInstance";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalConfrimPayment() {
  const { order_id } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bankData = `
David Ríos Reyes
20.368.565-3
Bci / Banco de credito e inversiones
Cuenta vista
777020368565
david.alberto2212@gmail.com
  `.trim();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(bankData);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const addVoucher = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();

      formData.append("image", {
        uri: selectedImage,
        name: "voucher.jpg",
        type: "image/jpeg",
      } as any);

      await axiosInstance.post(`/api/orders/update/${order_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      console.log("error al enviar comprobante", error.response);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Caja datos bancarios --- */}
          <View className="bg-white pt-5 rounded-lg shadow shadow-black mb-6">
            <View className="w-full p-5 bg-slate-100">
              <Text className="text-xl font-semibold">
                Información bancaria
              </Text>
              <Text className="text-sm text-text-secondary">
                Use estos datos para realizar su transferencia o depósito
              </Text>
            </View>

            <View className="p-5 flex-row justify-between items-start">
              <View>
                <Text>David Ríos Reyes</Text>
                <Text>20.368.565-3</Text>
                <Text>Bci / Banco de credito e inversiones</Text>
                <Text>Cuenta vista</Text>
                <Text>777020368565</Text>
                <Text>david.alberto2212@gmail.com</Text>
              </View>

              <TouchableOpacity onPress={handleCopy}>
                <Ionicons name="copy-outline" size={26} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- Caja comprobante --- */}
          <View className="bg-white pt-5 rounded-lg shadow shadow-black mb-6">
            <View className="w-full p-5">
              <Text className="text-xl font-semibold">Comprobante de pago</Text>
              <Text className="text-sm text-text-secondary">
                Suba una foto del comprobante de depósito o transferencia
                (máximo 1 imagen)
              </Text>
            </View>

            <View className="p-5">
              {selectedImage ? (
                <View className="items-center">
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: "100%", height: 260, borderRadius: 12 }}
                    resizeMode="contain"
                  />

                  <TouchableOpacity
                    onPress={pickImage}
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600"
                  >
                    <Text className="text-white font-semibold">
                      Cambiar imagen
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  activeOpacity={0.7}
                  className="border-2 border-dashed border-gray-400 rounded-xl p-8 items-center"
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={40}
                    color="#6b7280"
                  />
                  <Text className="text-base text-gray-700 mt-3 text-center">
                    Haga clic para subir o arrastre la imagen aquí
                  </Text>
                  <Text className="text-xs text-gray-500 mt-2">
                    PNG, JPG hasta 10MB (0/1)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="px-5 pb-5">
              <TouchableOpacity
                onPress={addVoucher}
                className={`rounded-lg py-3 ${
                  selectedImage ? "bg-blue-600" : "bg-gray-300"
                }`}
                disabled={!selectedImage}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedImage ? "text-white" : "text-gray-500"
                  }`}
                >
                  Enviar Comprobante
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Texto final */}
          <View className="bg-black/10 p-5 border border-slate-500 rounded-lg">
            <Text className="text-sm text-text-secondary text-center">
              Una vez procesado su depósito, recibirá una confirmación por
              correo electrónico. El procesamiento puede tardar de 1 a 3 días
              hábiles.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
