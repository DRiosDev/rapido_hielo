import { useAuthUser } from "@/store/useAuthUser";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button, List } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { userLogged, getMe } = useAuthUser();

  const fetchUser = async () => {
    try {
      await getMe();
    } catch (error: any) {
      console.error("Error al obtener usuario:", error.message);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 m-10">
        <View className="gap-4">
          <Text className="text-2xl">Datos del usuario</Text>

          {/* Modal */}
          <Link asChild push href="/modal">
            <Button>Abrir modal</Button>
          </Link>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
