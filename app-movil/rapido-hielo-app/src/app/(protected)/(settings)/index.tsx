import { BackButtonNavegation } from "@/components/navegation/BackButtonNavegation";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { List, RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">("system");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const openThemeModal = () => {
    setIsThemeModalOpen(true);
    bottomSheetRef.current?.expand();
  };

  const changeTheme = (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
    setIsThemeModalOpen(false);
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setColorScheme(theme);
    }, 100);
  };

  const getThemeLabel = () => {
    if (selectedTheme === "system") return "Automático (Sistema)";
    if (selectedTheme === "light") return "Claro";
    if (selectedTheme === "dark") return "Oscuro";
    return "Automático (Sistema)";
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Configuración",
          headerShadowVisible: false,
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-gray-50 dark:bg-slate-900"
        edges={["left", "right", "bottom"]}
      >
        <View className="flex-1 pt-4">
          <View className="bg-white dark:bg-slate-800 px-4">
            <List.Item
              title={<Text className="font-semibold text-black dark:text-white">Apariencia</Text>}
              description={
                <Text className="text-gray-500 dark:text-gray-400">{getThemeLabel()}</Text>
              }
              style={[styles.list_item, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#F2F4F6' }]}
              rippleColor="transparent"
              left={() => (
                <View className="p-3 rounded-full bg-badge-gray dark:bg-slate-700 self-center">
                  <Ionicons name="color-palette-outline" size={19} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </View>
              )}
              right={() => (
                <View className="justify-center">
                  <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </View>
              )}
              onPress={openThemeModal}
            />

            <List.Item
              title={<Text className="font-semibold text-black dark:text-white">Sobre Nosotros</Text>}
              style={[styles.list_item, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#F2F4F6' }]}
              rippleColor="transparent"
              left={() => (
                <View className="p-3 rounded-full bg-badge-gray dark:bg-slate-700 self-center">
                  <Ionicons name="information-circle-outline" size={19} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </View>
              )}
              right={() => (
                <View className="justify-center">
                  <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </View>
              )}
              onPress={() => router.push("/(protected)/(settings)/about")}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Selector de Tema */}
      <BottomSheet
        ref={bottomSheetRef}
        index={isThemeModalOpen ? 0 : -1}
        snapPoints={["35%"]}
        enablePanDownToClose
        onClose={() => setIsThemeModalOpen(false)}
        backgroundStyle={{ backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'white' }}
        handleIndicatorStyle={{ backgroundColor: colorScheme === 'dark' ? '#475569' : '#cbd5e1' }}
      >
        <BottomSheetView className="p-6">
          <Text className="text-xl font-bold mb-4 text-black dark:text-white">Elegir apariencia</Text>
          
          <RadioButton.Group
            onValueChange={(value) => changeTheme(value as any)}
            value={selectedTheme}
          >
            <RadioButton.Item label="Automático (Sistema)" value="system" labelStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }} />
            <RadioButton.Item label="Modo Claro" value="light" labelStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }} />
            <RadioButton.Item label="Modo Oscuro" value="dark" labelStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }} />
          </RadioButton.Group>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  list_item: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F6",
    width: "100%",
    paddingVertical: 12,
  },
});
