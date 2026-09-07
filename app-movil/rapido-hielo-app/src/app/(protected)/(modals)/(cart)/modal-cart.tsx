import { BackButtonNavegation } from "@/components/navegation/BackButtonNavegation";
import CustomButton from "@/components/ui/design/CustomButton";
import CustomTextInput from "@/components/ui/design/CustomTextInput";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Colors } from "@/constants/Colors";
import { useAuthUser } from "@/store/useAuthUser";
import { useCartStore } from "@/store/useCarts";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ConfirmedCartBT,
  ConfirmedCartBTRef,
} from "@/components/ui/BottomSheets/Cart/ConfirmedCartBT";
import { axiosInstance } from "@/axios/axiosInstance";

export default function ModalCart() {
  const { userLogged } = useAuthUser();
  const {
    cartUsed,
    items,
    itemCount,
    fetchCartItemCount,
    updateQuantity,
    removeItem,
    removeAllItems,
  } = useCartStore();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const BottomSheetRef = useRef<ConfirmedCartBTRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userLogged?.id) fetchCartItemCount(userLogged.id);
  }, [userLogged, fetchCartItemCount]);

  const handleQuantityChange = (id: string, value: string | number) => {
    const new_quantity =
      typeof value === "number"
        ? Math.max(1, value)
        : Math.max(1, parseInt(value.replace(/[^0-9]/g, ""), 10) || 1);

    updateQuantity(id, new_quantity);
  };

  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const handleOrder = async ({ date, time, payment }) => {
    if (!cartUsed) {
      return;
    }
    setIsLoading(true);

    try {
      const payload = {
        date_delivery: date,
        hour_delivery: time,
        method_payment: String(payment),
      };

      const response = await axiosInstance.post(
        `/api/orders/${cartUsed}`,
        payload
      );

      const orderId = response.data.order.id;

      if (userLogged?.id) {
        useCartStore.getState().fetchCartItemCount(userLogged.id);
      }

      if (payment === 2) {
        router.push(`/modal-confirm-payment?order_id=${orderId}`);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error al crear orden", error?.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Mi Carrito",
          headerShadowVisible: false,
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      {isLoading && <LoadingOverlay />}

      <SafeAreaView
        className="flex-1 bg-slate-50 dark:bg-slate-900"
        style={{ padding: 16 }}
        edges={["left", "right", "bottom"]}
      >
        <View className="flex-1">
          {/* Banner Dirección */}
          <View
            className="flex-row items-center gap-3 p-4 rounded-2xl mb-4 border border-indigo-100 dark:border-slate-700 bg-indigo-50/70 dark:bg-slate-800"
          >
            <View className="p-2 rounded-xl bg-white dark:bg-slate-700">
              <Ionicons name="location" size={22} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Dirección de entrega
              </Text>
              <Text className="text-base font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                {userLogged?.address || "Sin dirección registrada"}
              </Text>
            </View>
          </View>

          {/* Lista de productos */}
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {items.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons name="cart-outline" size={70} color={isDark ? "#64748B" : Colors.textSecondary} style={{ opacity: 0.5 }} />
                <Text
                  className="text-lg font-bold mt-4 text-slate-900 dark:text-white"
                >
                  Tu carrito está vacío
                </Text>
                <Text className="text-sm mt-1 text-center text-slate-500 dark:text-slate-400">
                  Agrega algunos sacos de hielo para continuar
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View
                  key={item.id}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-3 border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-2">
                      <Text className="text-base font-bold text-slate-900 dark:text-white">
                        {item.name_product}
                      </Text>
                      <Text className="text-sm font-semibold mt-0.5" style={{ color: Colors.primary }}>
                        ${item.price_product} c/u
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/30"
                    >
                      <Ionicons name="trash-outline" size={18} color={Colors.redError} />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Subtotal: ${(item.price_product * (item.quantity_item ?? 1)).toLocaleString()}
                    </Text>

                    <View className="flex-row items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-1 rounded-xl">
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, item.quantity_item - 1)}
                        className="w-8 h-8 rounded-lg items-center justify-center bg-white dark:bg-slate-600 shadow-xs"
                      >
                        <Ionicons name="remove" size={16} color={isDark ? "white" : Colors.textPrimary} />
                      </TouchableOpacity>

                      <Text className="w-8 text-center font-bold text-base text-slate-900 dark:text-white">
                        {item.quantity_item ?? 1}
                      </Text>

                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, item.quantity_item + 1)}
                        className="w-8 h-8 rounded-lg items-center justify-center bg-white dark:bg-slate-600 shadow-xs"
                      >
                        <Ionicons name="add" size={16} color={isDark ? "white" : Colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Tarjeta de Resumen */}
          {items.length > 0 && (
            <View
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl mt-3 border border-slate-100 dark:border-slate-700"
            >
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Total ({itemCount} {itemCount === 1 ? "ítem" : "ítems"})
                </Text>
                <Text className="text-3xl font-extrabold" style={{ color: Colors.primary }}>
                  ${totalPrice.toLocaleString()}
                </Text>
              </View>

              <View className="mt-4 gap-2">
                <CustomButton
                  onPress={() => BottomSheetRef.current?.childFunction(0)}
                  mode="contained"
                  style={{ backgroundColor: Colors.primary }}
                >
                  Realizar pedido
                </CustomButton>

                <TouchableOpacity
                  onPress={() => removeAllItems(cartUsed)}
                  className="py-2.5 items-center justify-center"
                >
                  <Text className="text-sm font-semibold" style={{ color: Colors.redError }}>
                    Vaciar carrito
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <ConfirmedCartBT
            ref={BottomSheetRef}
            title="Resumen de compra"
            onConfirm={handleOrder}
            items={items}
            totalPrice={totalPrice}
            itemCount={itemCount}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
