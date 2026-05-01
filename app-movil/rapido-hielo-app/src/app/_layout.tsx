import HeaderLogo from "@/components/navegation/HeaderLogo";
import OfflineNotice from "@/components/ui/OfflineNotice";
import { Colors } from "@/constants/Colors";
import { NetworkProvider } from "@/context/NetworkContext";
import useInitialData from "@/hooks/useInitialData";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import { useAuthUser } from "@/store/useAuthUser";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ActivityIndicator, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { isAuthenticated, isLoadingInitialData } = useAuthUser();
  const { fontsLoaded } = useLoadFonts();
  useInitialData(); // Carga datos de usuario
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  const paperTheme = colorScheme === 'dark' ? {
    ...MD3DarkTheme,
    colors: { ...MD3DarkTheme.colors, primary: Colors.primary, secondary: Colors.primarySoft, error: "#EF4444" }
  } : {
    ...MD3LightTheme,
    colors: { ...MD3LightTheme.colors, primary: Colors.primary, secondary: Colors.primarySoft, error: "#EF4444" }
  };

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
          <PaperProvider theme={paperTheme}>
            <FlashMessage position="top" statusBarHeight={insets.top} />
            <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} />
            <NetworkProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
              </ThemeProvider>

              <OfflineNotice />
            </NetworkProvider>
          </PaperProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
