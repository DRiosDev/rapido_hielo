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
        <Text variant="titleMedium">No hay productos disponibles</Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.6 }}>
          Intenta nuevamente más tarde
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-1">
      {data.map((product) => (
        <Card key={product.id} style={{ marginBottom: 12 }}>
          <Card.Cover
            source={
              product.image
                ? { uri: product.image }
                : require("../../../assets/img-placeholder.png")
            }
            style={{
              height: 300,
              resizeMode: "contain",
              backgroundColor: "#fff",
            }}
          />
          <Card.Title
            title={product.name}
            subtitle={`Precio: $${product.price}`}
          />
          <Card.Content>
            <Text variant="bodyMedium">{product.description}</Text>
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