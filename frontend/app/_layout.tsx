import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Splash from "@/components/Splash";
import { useColorScheme } from "@/hooks/useColorScheme";
import AuthScreen from "@/components/AuthScreen";
import { setUserRole } from "@/constants/Role";

SplashScreen.preventAutoHideAsync();

const splashScreenDuration = 2500;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isSplashScreenShown, setIsSplashScreenShown] = useState(true);
  const [role, setRole] = useState(-1);

  useEffect(() => {
    setTimeout(() => {
      setIsSplashScreenShown(false);
    }, splashScreenDuration);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleLogin = (role: number) => {
    setRole(role);
    setUserRole(role);
  };

  const handleVisitor = () => {
    setRole(0);
    setUserRole(0);
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {role >= 0 ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <AuthScreen onPressLogin={handleLogin} onPressVisitor={handleVisitor} />
      )}
      {isSplashScreenShown ? <Splash /> : null}
    </ThemeProvider>
  );
}
