import { Colors } from "@/constants/Colors";
import { useAuthUser } from "@/store/useAuthUser";
import { useCartStore } from "@/store/useCarts";
import { useProducts } from "@/store/useProducts";
import { Product } from "@/types/Product";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";
import CustomButton from "./design/CustomButton";
import CustomTextInput from "./design/CustomTextInput";
import { axiosInstance } from "@/axios/axiosInstance";

type ChildFunction = (id?: Product["id"]) => void;

export interface ConfirmAddItemCartBSRef {
  childFunction: ChildFunction;
}

interface ConfirmAddItemCartBSProps {}

export const ConfirmAddItemCartBS = forwardRef<
  ConfirmAddItemCartBSRef,
  ConfirmAddItemCartBSProps
>((props, ref) => {
  const { userLogged } = useAuthUser();
  const { products } = useProducts();

  const [quantity, set_quantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const childFunction: ChildFunction = (id) => {
    if (!id) return;

    const found = products.find((p) => p.id === id) || null;
    setProduct(found);
    setIsOpen(true);
    sheetRef.current?.snapToIndex(0);
  };

  useImperativeHandle(ref, () => ({
    childFunction,
    close,
  }));

  const snapPoints = useMemo(() => ["42%"], []);

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
    []
  );

  const close = () => {
    sheetRef.current?.close();
    setProduct(null);
    set_quantity(1);
  };

  const handleIncrease = () => {
    set_quantity((prev) => Math.min(prev + 1, 99));
  };

  const handleDecrease = () => {
    set_quantity((prev) => Math.max(prev - 1, 1));
  };

  const handleQuantityChange = (text: string) => {
    const num = text.replace(/[^0-9]/g, "");
    if (num.length > 2) return;
    const parsed = num === "" ? 1 : parseInt(num, 10);
    set_quantity(parsed < 1 ? 1 : parsed);
  };

  const handleConfirm = useCallback(async () => {
    if (!product) return;

    try {
      const payload = {
        client_id: userLogged.id,
        quantity,
      };

      const response = await axiosInstance.post(
        `/api/carts/${product.id}`,
        payload
      );

      if (response.status === 200) {
        const { fetchCartItemCount } = useCartStore.getState();
        await fetchCartItemCount(userLogged.id);
      }

      Alert.alert("Éxito", "Producto agregado al carrito.");
    } catch (error: any) {
      console.error("Error al agregar producto:", error);
      Alert.alert("Error", "No se pudo agregar el producto al carrito.");
    }
    close();
  }, [product, quantity]);

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
            <View className="flex-1 justify-between p-6 bg-white dark:bg-slate-800">
              <View>
                <Text
                  className="text-2xl font-bold mb-1"
                  style={{ color: Colors.textPrimary }}
                >
                  {product?.name}
                </Text>
                <Text
                  className="text-base font-semibold"
                  style={{ color: Colors.primary }}
                >
                  ${product?.price} por unidad
                </Text>
              </View>

              {/* Selector de Cantidad */}
              <View className="flex-row items-center justify-center my-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                <TouchableOpacity
                  onPress={handleDecrease}
                  className="w-12 h-12 rounded-xl justify-center items-center active:bg-slate-200"
                  style={{ backgroundColor: Colors.primarySoft }}
                >
                  <Ionicons name="remove" size={24} color={Colors.primary} />
                </TouchableOpacity>

                <View className="mx-6 w-16">
                  <CustomTextInput
                    value={quantity.toString()}
                    onChangeText={handleQuantityChange}
                    keyboardType="numeric"
                    maxLength={2}
                    style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleIncrease}
                  className="w-12 h-12 rounded-xl justify-center items-center active:bg-slate-200"
                  style={{ backgroundColor: Colors.primarySoft }}
                >
                  <Ionicons name="add" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <CustomButton
                    mode="outlined"
                    onPress={close}
                    style={{ borderColor: Colors.textSecondary }}
                    labelStyle={{ color: Colors.textSecondary }}
                  >
                    Cancelar
                  </CustomButton>
                </View>
                <View className="flex-1">
                  <CustomButton
                    style={{ backgroundColor: Colors.primary }}
                    onPress={() => handleConfirm()}
                  >
                    Agregar
                  </CustomButton>
                </View>
              </View>
            </View>
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
