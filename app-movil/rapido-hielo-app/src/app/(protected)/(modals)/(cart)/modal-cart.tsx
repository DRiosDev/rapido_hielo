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
import { ScrollView, Text, View } from "react-native";
import { Button, Card, IconButton, Menu } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
    setIsLoading(true);

    try {
      const payload = {
        date_delivery: date,
        hour_delivery: time,
        method_payment: payment,
      };

      const response = await axiosInstance.post(
        `/api/orders/${cartUsed}`,
        payload
      );

      const orderId = response.data.order.id;

      // Redirección según método de pago
      if (payment === 2) {
        router.push(`/modal-confirm-payment?order_id=${orderId}`);
      } else {
        router.push("/"); // home
      }
    } catch (error) {
      console.error("Error al crear orden", error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Carro",
          headerShadowVisible: false,
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      {isLoading && <LoadingOverlay />}

      <SafeAreaView
        style={{ flex: 1, padding: 16 }}
        edges={["left", "right", "bottom"]}
      >
        <View style={{ flex: 1 }}>
          <View className="flex-row gap-3 bg-white p-5 rounded-lg shadow shadow-black justify-center mb-5">
            <Ionicons name="location-outline" size={28} color="black" />
            <Text className="text-xl font-semibold">{userLogged.address}</Text>
          </View>

          {/* <View className="bg-white p-5 rounded-lg shadow shadow-black mb-5">
            <Text className="text-xl font-semibold mb-4">
              Programa tu despacho
            </Text>

            
            <Text className="text-base font-semibold mb-1">Día de entrega</Text>

            <Button
              mode="outlined"
              onPress={showDatePicker}
              contentStyle={{ justifyContent: "space-between" }}
              style={{ borderRadius: 8 }}
              icon="calendar"
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("es-CL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : "Selecciona un día"}
            </Button>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              locale="es-CL"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />

            
            <Text className="text-base font-semibold mt-5 mb-1">
              Horario de entrega
            </Text>

            <Menu
              visible={timeMenuVisible}
              onDismiss={() => setTimeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setTimeMenuVisible(true)}
                  contentStyle={{ justifyContent: "space-between" }}
                  style={{ borderRadius: 8 }}
                  icon="clock-outline"
                >
                  {selectedTime ?? "Selecciona un horario"}
                </Button>
              }
            >
              {availableHours.map((hour) => (
                <Menu.Item
                  key={hour}
                  onPress={() => {
                    setSelectedTime(hour);
                    setTimeMenuVisible(false);
                  }}
                  title={hour}
                />
              ))}
            </Menu>
          </View> */}

          <ScrollView showsVerticalScrollIndicator={false}>
            {items.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 40,
                  fontSize: 18,
                  color: "gray",
                }}
              >
                No hay productos en el carrito
              </Text>
            ) : (
              items.map((item) => (
                <Card
                  key={item.id}
                  style={{
                    marginBottom: 16,
                    backgroundColor: "white",
                    borderRadius: 12,
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <Card.Title
                    title={item.name_product}
                    subtitle={`$${item.price_product}`}
                    right={() => (
                      <IconButton
                        icon="delete-outline"
                        onPress={() => removeItem(item.id)}
                      />
                    )}
                  />
                  <Card.Content>
                    <View className="flex-row items-center justify-center">
                      <Button
                        mode="contained"
                        compact
                        onPress={() =>
                          handleQuantityChange(item.id, item.quantity_item - 1)
                        }
                      >
                        -
                      </Button>

                      <CustomTextInput
                        value={(item.quantity_item ?? 1).toString()}
                        onChangeText={(text) =>
                          handleQuantityChange(item.id, text)
                        }
                        keyboardType="numeric"
                        maxLength={2}
                        style={{ textAlign: "center", width: 60 }}
                      />

                      <Button
                        mode="contained"
                        compact
                        onPress={() =>
                          handleQuantityChange(item.id, item.quantity_item + 1)
                        }
                      >
                        +
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </ScrollView>

          <View className="bg-white p-5 rounded-lg shadow shadow-black mt-5">
            <Text className="text-2xl font-semibold text-center mb-2">
              $ {totalPrice}
            </Text>

            <Text className="text-lg text-center font-semibold mb-4">
              Total ítems en carrito: {itemCount}
            </Text>

            <CustomButton
              onPress={() => BottomSheetRef.current?.childFunction(0)}
              mode="contained"
            >
              Realizar pedido
            </CustomButton>
            <CustomButton
              onPress={() => removeAllItems(cartUsed)}
              style={{ backgroundColor: Colors.redError, marginTop: 10 }}
              mode="contained"
            >
              Eliminar productos
            </CustomButton>
          </View>

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
