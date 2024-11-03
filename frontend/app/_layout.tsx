import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Splash from "@/components/Splash";
import { useColorScheme } from "@/hooks/useColorScheme";
import AuthScreen from "@/components/AuthScreen";
import React from 'react';
import { UserRoleProvider, useUserRole } from "@/context/UserRoleContext";

SplashScreen.preventAutoHideAsync();

const splashScreenDuration = 2500;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isSplashScreenShown, setIsSplashScreenShown] = useState(true);

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

  return (
    <UserRoleProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <MainContent />
        {isSplashScreenShown ? <Splash /> : null}
      </ThemeProvider>
    </UserRoleProvider>
  );
}

function MainContent() {
  const { userRole } = useUserRole();

  return userRole !== null && userRole >= 0 ? (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  ) : (
    <AuthScreen />
  );
}

