import CardProductList from "@/components/ui/CardProduct";
import {
  ConfirmAddItemCartBS,
  ConfirmAddItemCartBSRef,
} from "@/components/ui/ConfirmAddItemCartBS";
import { useProducts } from "@/store/useProducts";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const { products, fetchProducts } = useProducts();

  const BottomSheetRef = useRef<ConfirmAddItemCartBSRef>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const addItem = (id: string) => {
    BottomSheetRef.current?.childFunction(id);
  };

  return (
    <>
      <SafeAreaView className="flex-1 justify-between bg-gray-50 dark:bg-slate-900">
        <View className="flex-1 p-4">
          <CardProductList
            data={products}
            addItem={(value) => addItem(value)}
          />
        </View>

        <ConfirmAddItemCartBS ref={BottomSheetRef} />
      </SafeAreaView>
    </>
  );
}
