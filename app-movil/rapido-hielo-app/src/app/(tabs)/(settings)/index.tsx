import { useAuthUser } from "@/store/useAuthUser";
import React from "react";
import { Text, View } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function settings() {
  const { userLogged, logout } = useAuthUser();

  return (
    <>
      <SafeAreaView className="flex-1 px-6 pt-8">
        <Text className="mb-6 text-4xl font-semi-bold">Ajustes</Text>
        <View className="items-center gap-5">
          <Avatar.Text
            size={110}
            label={userLogged?.name[0] + userLogged?.lastname[0]}
          />
          <View className="items-center">
            <Text className="text-2xl font-semi-bold">
              {userLogged?.name + " " + userLogged?.lastname}
            </Text>
            <Text className="text-base font-medium text-text-secondary">
              {userLogged?.email}
            </Text>
          </View>

          <Button mode="contained" buttonColor="red" onPress={logout}>
            Log Out
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
