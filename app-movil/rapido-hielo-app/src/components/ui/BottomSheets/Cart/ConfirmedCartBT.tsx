import { axiosInstance } from "@/axios/axiosInstance";
import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Checkbox, Menu, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../design/CustomButton";
import { Ionicons } from "@expo/vector-icons";

export interface ConfirmedCartBTRef {
  childFunction: (index: number) => void;
}

interface ConfirmedCartBTProps {
  title?: string;
  message?: string;
  onConfirm: (data: {
    date: Date | null;
    time: string | null;
    payment: number | null;
  }) => void;
  items: any[];
  totalPrice: number;
  itemCount: number;
}

export const ConfirmedCartBT = forwardRef<
  ConfirmedCartBTRef,
  ConfirmedCartBTProps
>((props, ref) => {
  const sheetRef = useRef<BottomSheet>(null);
  const { title = "Resumen de compra", message, onConfirm, items, totalPrice } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeMenuVisible, setTimeMenuVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<string[]>([
    "09:00 - 12:00",
    "12:00 - 15:00",
    "15:00 - 18:00",
    "18:00 - 21:00",
  ]);

  const fetchDeliverySlots = async () => {
    try {
      const response = await axiosInstance.get("/api/delivery-slots");
      if (Array.isArray(response.data) && response.data.length > 0) {
        const slotNames = response.data.map((item: any) => item.slot);
        setAvailableSlots(slotNames);
      }
    } catch (error) {
      console.log("Error al cargar rangos horarios:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDeliverySlots();
    }
  }, [isOpen]);

  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const isConfirmDisabled = !selectedDate || !selectedTime || !selectedPayment;

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    setIsDatePickerVisible(false);
  };

  const childFunction = () => {
    setIsOpen(true);
    sheetRef.current?.snapToIndex(0);
  };

  const close = () => {
    sheetRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    childFunction,
    close,
  }));

  const snapPoints = useMemo(() => ["75%"], []);

  const handleConfirm = useCallback(() => {
    onConfirm({
      date: selectedDate,
      time: selectedTime,
      payment: selectedPayment,
    });
    close();
  }, [onConfirm, selectedDate, selectedTime, selectedPayment]);

  const handleSheetClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  return (
    <Portal>
      {isOpen && (
        <GestureHandlerRootView
          style={[styles.container, !isOpen && { pointerEvents: "none" }]}
        >
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onClose={handleSheetClose}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: "#CBD5E1", width: 40 }}
          >
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-800">
              <View className="px-6 pt-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <Text className="text-2xl font-bold" style={{ color: Colors.textPrimary }}>
                  {title}
                </Text>
                {message && (
                  <Text className="text-sm mt-0.5" style={{ color: Colors.textSecondary }}>
                    {message}
                  </Text>
                )}
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="p-6">
                <View className="gap-6 pb-6">
                  {/* Resumen del carrito */}
                  <View className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <Text className="text-base font-bold mb-3" style={{ color: Colors.textPrimary }}>
                      Productos a despachar
                    </Text>

                    {items.map((item) => (
                      <View key={item.id} className="flex-row justify-between mb-2">
                        <Text className="text-sm" style={{ color: Colors.textSecondary }}>
                          {item.name_product} <Text className="font-bold">x{item.quantity_item}</Text>
                        </Text>
                        <Text className="text-sm font-semibold" style={{ color: Colors.textPrimary }}>
                          ${(item.price_product * item.quantity_item).toLocaleString()}
                        </Text>
                      </View>
                    ))}

                    <View className="border-t border-slate-200 dark:border-slate-600 mt-3 pt-3 flex-row justify-between items-center">
                      <Text className="text-base font-bold" style={{ color: Colors.textPrimary }}>
                        Total Final
                      </Text>
                      <Text className="text-xl font-extrabold" style={{ color: Colors.primary }}>
                        ${totalPrice.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Selector día/hora de despacho */}
                  <View>
                    <Text className="text-base font-bold mb-3" style={{ color: Colors.textPrimary }}>
                      Programar Entrega
                    </Text>

                    {/* Fecha */}
                    <Text className="text-xs font-semibold mb-1" style={{ color: Colors.textSecondary }}>
                      Día de entrega
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsDatePickerVisible(true)}
                      className="flex-row justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 mb-4"
                    >
                      <Text className="text-sm font-medium" style={{ color: selectedDate ? Colors.textPrimary : Colors.textPlaceholder }}>
                        {selectedDate
                          ? selectedDate.toLocaleDateString("es-CL", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })
                          : "Selecciona un día"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                    </TouchableOpacity>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      minimumDate={new Date()}
                      mode="date"
                      locale="es-CL"
                      onConfirm={handleConfirmDate}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />

                    {/* Horario */}
                    <Text className="text-xs font-semibold mb-1" style={{ color: Colors.textSecondary }}>
                      Horario de entrega
                    </Text>
                    <Menu
                      visible={timeMenuVisible}
                      onDismiss={() => setTimeMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          onPress={() => setTimeMenuVisible(true)}
                          className="flex-row justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        >
                          <Text className="text-sm font-medium" style={{ color: selectedTime ? Colors.textPrimary : Colors.textPlaceholder }}>
                            {selectedTime ?? "Selecciona un horario"}
                          </Text>
                          <Ionicons name="time-outline" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                      }
                    >
                      {availableSlots.map((hour) => (
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
                  </View>

                  {/* Método de pago */}
                  <View>
                    <Text className="text-base font-bold mb-3" style={{ color: Colors.textPrimary }}>
                      Método de Pago
                    </Text>

                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => setSelectedPayment(1)}
                        className={`flex-1 p-3.5 rounded-xl border flex-row items-center gap-2 ${
                          selectedPayment === 1
                            ? "border-indigo-600 bg-indigo-50/50"
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        }`}
                      >
                        <Checkbox
                          status={selectedPayment === 1 ? "checked" : "unchecked"}
                          color={Colors.primary}
                          onPress={() => setSelectedPayment(1)}
                        />
                        <Text className="text-sm font-semibold" style={{ color: Colors.textPrimary }}>
                          Efectivo
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedPayment(2)}
                        className={`flex-1 p-3.5 rounded-xl border flex-row items-center gap-2 ${
                          selectedPayment === 2
                            ? "border-indigo-600 bg-indigo-50/50"
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        }`}
                      >
                        <Checkbox
                          status={selectedPayment === 2 ? "checked" : "unchecked"}
                          color={Colors.primary}
                          onPress={() => setSelectedPayment(2)}
                        />
                        <Text className="text-sm font-semibold" style={{ color: Colors.textPrimary }}>
                          Transferencia
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CustomButton
                  disabled={isConfirmDisabled}
                  onPress={handleConfirm}
                  style={{ backgroundColor: isConfirmDisabled ? "#CBD5E1" : Colors.primary }}
                >
                  Confirmar pedido
                </CustomButton>
              </View>
            </SafeAreaView>
          </BottomSheet>
        </GestureHandlerRootView>
      )}
    </Portal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    inset: 0,
    zIndex: 9999,
  },
});
