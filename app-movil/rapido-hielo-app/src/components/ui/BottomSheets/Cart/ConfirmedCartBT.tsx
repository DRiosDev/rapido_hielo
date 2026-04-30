import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Checkbox, Menu, Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../design/CustomButton";

export interface ConfirmedCartBTRef {
  childFunction: (index: number) => void; // Definimos el tipo con parámetros
}

interface ConfirmedCartBTProps {
  title?: string;
  message?: string;
  onConfirm: (data: {
    date: Date | null;
    time: string | null;
    payment: number | null;
  }) => void;
  items: any[]; // lista de items del carrito
  totalPrice: number; // total
  itemCount: number; // cantidad total
}

export const ConfirmedCartBT = forwardRef<
  ConfirmedCartBTRef,
  ConfirmedCartBTProps
>((props, ref) => {
  const sheetRef = useRef<BottomSheet>(null);

  const { title, message, onConfirm, items, totalPrice, itemCount } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [timeMenuVisible, setTimeMenuVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableHours = [
    "09:00 - 11:00",
    "11:00 - 13:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
  ];

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

  // expone funciones al padre
  useImperativeHandle(ref, () => ({
    childFunction,
    close,
  }));

  const snapPoints = useMemo(() => ["70%"], []);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm({
      date: selectedDate,
      time: selectedTime,
      payment: selectedPayment,
    });
    close();
  }, [onConfirm, selectedDate, selectedTime, selectedPayment]);

  const handleSheetClose = useCallback(() => {
    setIsOpen(false); // también al cerrar por swipe
  }, []);

  // 👇 Backdrop que solo aparece en el índice 0 (25%)
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0} // aparece cuando el sheet está en snapPoint 0
        disappearsOnIndex={-1} // desaparece cuando se cierra
        opacity={0.5} // opacidad del fondo
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
            onChange={handleSheetChange}
            onClose={handleSheetClose}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop} // 👈 usa la función personalizada
          >
            <SafeAreaView className="flex-1">
              <View className="pt-5 pl-5">
                <Text className="text-xl font-bold mb-2">{title}</Text>
                <Text className="text-base text-text-secondary">{message}</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-col justify-between gap-6">
                  {/* Resumen del carrito */}
                  <View className="p-5 border-b border-gray-400">
                    <Text className="text-xl font-bold mb-3">Productos</Text>

                    {items.map((item) => (
                      <View
                        key={item.id}
                        className="flex-row justify-between mb-2"
                      >
                        <Text className="text-base">
                          {item.name_product} x{item.quantity_item}
                        </Text>
                        <Text className="text-base font-semibold">
                          ${item.price_product}
                        </Text>
                      </View>
                    ))}

                    <View className="border-t border-gray-300 mt-3 pt-3 flex-row justify-between">
                      <Text className="text-lg font-semibold">Total</Text>
                      <Text className="text-lg font-bold">${totalPrice}</Text>
                    </View>
                  </View>

                  {/* Selector día/hora de despacho */}
                  <View className="p-5 border-b border-gray-400">
                    <Text className="text-xl font-semibold mb-4">Entrega</Text>

                    {/* Fecha */}
                    <Text className="text-base font-semibold mb-1">
                      Día de entrega
                    </Text>

                    <Button
                      mode="outlined"
                      onPress={() => setIsDatePickerVisible(true)}
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
                      minimumDate={new Date()}
                      mode="date"
                      locale="es-CL"
                      onConfirm={handleConfirmDate}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />

                    {/* Horario */}
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
                  </View>

                  {/* Metodo de pago */}
                  <View className="p-5 mb-2">
                    {/* Método de pago */}
                    <Text className="text-xl font-semibold mb-4">
                      Método de pago
                    </Text>

                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <Checkbox
                          status={
                            selectedPayment === 1 ? "checked" : "unchecked"
                          }
                          onPress={() => setSelectedPayment(1)}
                        />
                        <Text className="text-base">Efectivo</Text>
                      </View>

                      <View className="flex-row items-center">
                        <Checkbox
                          status={
                            selectedPayment === 2 ? "checked" : "unchecked"
                          }
                          onPress={() => setSelectedPayment(2)}
                        />
                        <Text className="text-base">transferencia</Text>
                      </View>
                    </View>
                  </View>

                  {/* Botón final */}
                </View>
              </ScrollView>
              <View className="mb-5 p-5">
                <CustomButton
                  disabled={isConfirmDisabled}
                  onPress={handleConfirm}
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
    position: "absolute",
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
