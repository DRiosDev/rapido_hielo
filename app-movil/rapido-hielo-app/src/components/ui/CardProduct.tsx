import { Product } from "@/types/Product";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

interface Props {
  data: Product[];
  addItem: (id: string) => void;
}

export default function CardProductList({ data, addItem }: Props) {
  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text variant="titleMedium" className="dark:text-white">No hay productos disponibles</Text>
        <Text variant="bodyMedium" className="dark:text-gray-400" style={{ marginTop: 8, opacity: 0.6 }}>
          Intenta nuevamente más tarde
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-1">
      {data.map((product) => (
        <Card key={product.id} className="bg-white dark:bg-slate-800" style={{ marginBottom: 16, borderRadius: 16, elevation: 4 }}>
          <Card.Cover
            source={
              product.image
                ? { uri: product.image }
                : require("../../../assets/img-placeholder.png")
            }
            style={{
              height: 250,
              resizeMode: "cover",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          />
          <Card.Title
            title={<Text className="font-bold text-lg dark:text-white">{product.name}</Text>}
            subtitle={<Text className="text-gray-600 dark:text-gray-300">Precio: ${product.price}</Text>}
          />
          <Card.Content>
            <Text variant="bodyMedium" className="dark:text-gray-300">{product.description}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => addItem(product.id)} mode="outlined">
              Agregar
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}