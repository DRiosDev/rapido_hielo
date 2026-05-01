import { BackButtonNavegation } from "@/components/navegation/BackButtonNavegation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Order, useOrdersStore } from "@/store/useOrders";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Button, Card, Modal, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const { orders, isLoading, fetchOrders } = useOrdersStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment":
        return { label: "Pendiente de pago", color: "text-orange-500" };
      case "payment_under_review":
        return { label: "Pago en revisión", color: "text-blue-500" };
      case "paid":
        return { label: "Pagado", color: "text-green-500" };
      case "dispatched":
        return { label: "Despachado", color: "text-purple-500" };
      case "delivered":
        return { label: "Entregado", color: "text-gray-500" };
      default:
        return { label: status, color: "text-black" };
    }
  };

  const calculateTotal = (order: Order) => {
    return order.items.reduce(
      (acc, item) => acc + item.price_product * item.quantity,
      0
    );
  };

  const calculateTotalItems = (order: Order) => {
    return order.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  const renderItem = ({ item }: { item: Order }) => {
    const statusInfo = getStatusLabel(item.status);
    const total = calculateTotal(item);
    const totalItems = calculateTotalItems(item);

    return (
      <Card
        onPress={() => setSelectedOrder(item)}
        style={{
          marginBottom: 16,
          backgroundColor: "white",
          borderRadius: 12,
          elevation: 3,
        }}
      >
        <Card.Content>
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Orden #{item.number_order}</Text>
            <Text className="text-sm text-gray-500">
              {new Date(item.created_at).toLocaleDateString("es-CL")}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="pricetag-outline" size={16} color="gray" />
            <Text className="text-base ml-2">Total: ${total}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="cube-outline" size={16} color="gray" />
            <Text className="text-base ml-2">Ítems: {totalItems}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="card-outline" size={16} color="gray" />
            <Text className="text-base ml-2 capitalize">
              Pago: {item.method_payment == "1" ? "Pago en tienda" : "Transferencia"}
            </Text>
          </View>

          <View className="mt-2 pt-2 border-t border-gray-200">
            <Text className={`text-base font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Mis Compras",
          headerShadowVisible: false,
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      {isLoading && <LoadingOverlay />}

      <SafeAreaView
        style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}
        edges={["left", "right", "bottom"]}
      >
        {orders.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="bag-remove-outline" size={64} color="gray" />
            <Text className="text-lg text-gray-500 mt-4">
              Aún no tienes compras
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </SafeAreaView>

      <Portal>
        <Modal
          visible={!!selectedOrder}
          onDismiss={() => setSelectedOrder(null)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 12,
            maxHeight: "80%",
          }}
        >
          {selectedOrder && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-2xl font-bold mb-4 text-center">
                Detalle de Orden #{selectedOrder.number_order}
              </Text>

              <View className="mb-5">
                <Text className="font-semibold text-lg mb-3">Productos:</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} className="flex-row justify-between mb-2">
                    <Text className="flex-1 text-base text-gray-700">
                      {item.name_product} <Text className="font-bold text-black">(x{item.quantity})</Text>
                    </Text>
                    <Text className="font-semibold text-base">
                      ${item.price_product * item.quantity}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="border-t border-gray-200 pt-4 mb-5">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-medium text-base text-gray-600">
                    Cantidad de ítems:
                  </Text>
                  <Text className="font-semibold text-base">
                    {calculateTotalItems(selectedOrder)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-bold text-xl">Total:</Text>
                  <Text className="font-bold text-xl">
                    ${calculateTotal(selectedOrder)}
                  </Text>
                </View>
              </View>

              <View className="mb-4 bg-gray-50 p-3 rounded-lg">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-medium text-gray-600">Pago:</Text>
                  <Text className="font-semibold">
                    {selectedOrder.method_payment == "1"
                      ? "Pago en tienda"
                      : "Transferencia"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-medium text-gray-600">Estado:</Text>
                  <Text
                    className={`font-semibold ${
                      getStatusLabel(selectedOrder.status).color
                    }`}
                  >
                    {getStatusLabel(selectedOrder.status).label}
                  </Text>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={() => setSelectedOrder(null)}
                className="mt-4"
              >
                Cerrar
              </Button>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </>
  );
}
