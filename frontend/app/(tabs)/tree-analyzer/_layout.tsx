import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { PermissionProvider } from "@/context/PermissionContext";
import React from "react";

export default function TreeAnalyzerStackLayout() {
  return (
    <PermissionProvider>
      <Stack>
        <Stack.Screen
          name="tree-analyzer-capture"
          options={{ title: "Tree Analyzer" }}
        />
        <Stack.Screen
          name="analysis-results"
          options={{ title: "Analyse Results" }}
        />
      </Stack>
    </PermissionProvider>
  );
}
const styles = StyleSheet.create({
  treeLogo: {
    height: 230,
    width: 310,
    bottom: 0,
    left: 36,
    position: "absolute",
  },
});
