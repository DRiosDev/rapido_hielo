import HeaderLogo from "@/components/navegation/HeaderLogo";
import OfflineNotice from "@/components/ui/OfflineNotice";
import theme from "@/config/themeConfig";
import { NetworkProvider } from "@/context/NetworkContext";
import useInitialData from "@/hooks/useInitialData";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import { useAuthUser } from "@/store/useAuthUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 🚫 no reintentar en fallos
    },
  },
});

export default function Layout() {
  const { isAuthenticated, isLoadingInitialData } = useAuthUser();
  const { fontsLoaded } = useLoadFonts();
  useInitialData(); // Carga datos de usuario
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoadingInitialData) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <FlashMessage position="top" statusBarHeight={insets.top} />
          <StatusBar style="dark" />
          <NetworkProvider>
            <Stack>
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />
              </Stack.Protected>
              <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen
                  name="sing-in"
                  options={{ ...HeaderLogo({ showBack: false }) }}
                />
                <Stack.Screen
                  name="sing-up"
                  options={{ ...HeaderLogo({ showBack: true }) }}
                />
                <Stack.Screen
                  name="recovery-password"
                  options={{ ...HeaderLogo({ showBack: true }) }}
                />
              </Stack.Protected>
            </Stack>

            <OfflineNotice />
          </NetworkProvider>
        </PaperProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}
