import { BackButtonNavegation } from "@/components/navegation/BackButtonNavegation";
import CustomButton from "@/components/ui/design/CustomButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Colors } from "@/constants/Colors";
import { Order, useOrdersStore } from "@/store/useOrders";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
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
        return { label: "Pendiente de pago", bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" };
      case "payment_under_review":
        return { label: "Pago en revisión", bg: "bg-sky-50 dark:bg-sky-900/30", text: "text-sky-600 dark:text-sky-400" };
      case "paid":
        return { label: "Pagado", bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" };
      case "dispatched":
        return { label: "Despachado", bg: "bg-indigo-50 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" };
      case "delivered":
        return { label: "Entregado", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" };
      default:
        return { label: status, bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" };
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
      <TouchableOpacity
        onPress={() => setSelectedOrder(item)}
        className="bg-white dark:bg-slate-800 p-5 rounded-3xl mb-4 border border-slate-100 dark:border-slate-700 shadow-sm active:opacity-90"
        style={{
          elevation: 3,
          shadowColor: Colors.textPrimary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }}
      >
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <View className="p-2 rounded-xl" style={{ backgroundColor: Colors.primarySoft }}>
              <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
            </View>
            <Text className="text-lg font-bold" style={{ color: Colors.textPrimary }}>
              Orden #{item.number_order}
            </Text>
          </View>
          <Text className="text-xs font-semibold" style={{ color: Colors.textSecondary }}>
            {new Date(item.created_at).toLocaleDateString("es-CL")}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 my-1 border-y border-slate-100 dark:border-slate-700">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="cube-outline" size={16} color={Colors.textSecondary} />
            <Text className="text-sm font-medium" style={{ color: Colors.textSecondary }}>
              {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
            </Text>
          </View>
          <Text className="text-lg font-extrabold" style={{ color: Colors.primary }}>
            ${total.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs font-semibold capitalize" style={{ color: Colors.textSecondary }}>
            {item.method_payment == "1" ? "Efectivo" : "Transferencia"}
          </Text>
          <View className={`px-3 py-1 rounded-full ${statusInfo.bg}`}>
            <Text className={`text-xs font-bold ${statusInfo.text}`}>
              {statusInfo.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Mis Compras",
          headerShadowVisible: false,
          headerTitleStyle: { color: Colors.textPrimary, fontWeight: "bold" },
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      {isLoading && <LoadingOverlay />}

      <SafeAreaView
        className="flex-1 bg-slate-50 dark:bg-slate-900"
        style={{ padding: 16 }}
        edges={["left", "right", "bottom"]}
      >
        {orders.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="bag-remove-outline" size={64} color={Colors.textSecondary} style={{ opacity: 0.4 }} />
            <Text className="text-lg font-bold mt-4" style={{ color: Colors.textPrimary }}>
              Aún no tienes compras
            </Text>
            <Text className="text-sm mt-1 text-center" style={{ color: Colors.textSecondary }}>
              Tus ordenes realizadas aparecerán aquí
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
            padding: 24,
            margin: 20,
            borderRadius: 24,
            maxHeight: "80%",
          }}
        >
          {selectedOrder && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-2xl font-bold mb-4 text-center" style={{ color: Colors.textPrimary }}>
                Detalle Orden #{selectedOrder.number_order}
              </Text>

              <View className="mb-5">
                <Text className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: Colors.textSecondary }}>
                  Productos
                </Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} className="flex-row justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <Text className="flex-1 text-sm font-medium" style={{ color: Colors.textPrimary }}>
                      {item.name_product} <Text className="font-bold" style={{ color: Colors.primary }}>(x{item.quantity})</Text>
                    </Text>
                    <Text className="font-bold text-sm" style={{ color: Colors.textPrimary }}>
                      ${(item.price_product * item.quantity).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-5 border border-slate-100 dark:border-slate-700">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm font-medium" style={{ color: Colors.textSecondary }}>
                    Método de pago:
                  </Text>
                  <Text className="text-sm font-bold" style={{ color: Colors.textPrimary }}>
                    {selectedOrder.method_payment == "1" ? "Efectivo" : "Transferencia"}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium" style={{ color: Colors.textSecondary }}>
                    Estado:
                  </Text>
                  <View className={`px-2.5 py-0.5 rounded-full ${getStatusLabel(selectedOrder.status).bg}`}>
                    <Text className={`text-xs font-bold ${getStatusLabel(selectedOrder.status).text}`}>
                      {getStatusLabel(selectedOrder.status).label}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between pt-2 border-t border-slate-200 dark:border-slate-700 items-center">
                  <Text className="text-base font-bold" style={{ color: Colors.textPrimary }}>
                    Total:
                  </Text>
                  <Text className="text-xl font-extrabold" style={{ color: Colors.primary }}>
                    ${calculateTotal(selectedOrder).toLocaleString()}
                  </Text>
                </View>
              </View>

              <CustomButton
                onPress={() => setSelectedOrder(null)}
                style={{ backgroundColor: Colors.primary }}
              >
                Cerrar
              </CustomButton>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </>
  );
}
