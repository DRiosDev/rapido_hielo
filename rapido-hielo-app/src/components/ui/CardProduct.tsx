import { Product } from "@/types/Product";
import React from "react";
import { ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";

interface Props {
  data: Product[];
}

export default function CardProductList({ data }: Props) {
  return (
    <ScrollView className="p-10">
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
              resizeMode: "contain", // muestra la imagen completa sin recortar
              backgroundColor: "#fff", // evita fondo gris
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
            <Button mode="outlined">Agregar</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}
