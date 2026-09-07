import { Colors } from "@/constants/Colors";
import { Product } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Image, Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "./design/CustomButton";

interface Props {
  data: Product[];
  addItem: (id: string) => void;
}

const AnimatedCard = ({ product, index, addItem }: { product: Product; index: number; addItem: (id: string) => void }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 350,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
        marginBottom: 20,
      }}
    >
      <View
        className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700"
        style={{
          elevation: 4,
          shadowColor: Colors.textPrimary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        {/* Banner de Imagen */}
        <View className="relative">
          <Image
            source={
              product.image
                ? { uri: product.image }
                : require("../../../assets/img-placeholder.png")
            }
            style={{
              width: "100%",
              height: 200,
              resizeMode: "cover",
            }}
          />
          {/* Badge superior */}
          <View
            className="absolute top-3 left-3 px-3 py-1 rounded-full flex-row items-center gap-1"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.92)" }}
          >
            <Ionicons name="sparkles" size={14} color={Colors.primary} />
            <Text className="text-xs font-bold" style={{ color: Colors.textPrimary }}>
              Despacho Rápido
            </Text>
          </View>
        </View>

        {/* Contenido de la Tarjeta */}
        <View className="p-5">
          <Text
            className="text-xl font-bold mb-1"
            style={{ color: Colors.textPrimary }}
          >
            {product.name}
          </Text>

          <Text
            className="text-sm mb-4 leading-relaxed"
            style={{ color: Colors.textSecondary }}
            numberOfLines={2}
          >
            {product.description || "Producto de alta calidad y entrega asegurada."}
          </Text>

          <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <View>
              <Text className="text-xs font-medium uppercase tracking-wider" style={{ color: Colors.textSecondary }}>
                Precio
              </Text>
              <Text className="text-2xl font-extrabold" style={{ color: Colors.primary }}>
                ${product.price}
              </Text>
            </View>

            <View style={{ width: 130 }}>
              <CustomButton
                mode="contained"
                onPress={() => addItem(product.id)}
                icon={({ size, color }) => (
                  <Ionicons name="cart-outline" size={18} color="white" />
                )}
                style={{ backgroundColor: Colors.primary }}
              >
                Agregar
              </CustomButton>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default function CardProductList({ data, addItem }: Props) {
  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Ionicons name="cube-outline" size={60} color={Colors.textSecondary} style={{ opacity: 0.5 }} />
        <Text className="text-lg font-bold mt-4" style={{ color: Colors.textPrimary }}>
          No hay productos disponibles
        </Text>
        <Text className="text-sm mt-1 text-center" style={{ color: Colors.textSecondary }}>
          Intenta nuevamente más tarde
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
      {data.map((product, index) => (
        <AnimatedCard key={product.id} product={product} index={index} addItem={addItem} />
      ))}
    </ScrollView>
  );
}