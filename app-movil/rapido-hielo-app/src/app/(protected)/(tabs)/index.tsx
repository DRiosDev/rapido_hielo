import CardProductList from "@/components/ui/CardProduct";
import { useProducts } from "@/store/useProducts";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <SafeAreaView className="flex-1 justify-between bg-white">
        <View className="flex-1 p-6 ">
          <CardProductList data={products} />
        </View>
      </SafeAreaView>
    </>
  );
}
