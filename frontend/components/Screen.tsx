// Screen.tsx
import React from "react";
import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TreeWave } from "@/components/TreeWave";


type ScreenProps = {
  title: string;
  content: React.ReactNode;
  headerImage: any;
};

export default function Screen({ title, content, headerImage }: ScreenProps) {
  return (
    <ParallaxScrollView headerImage={headerImage}>
      <ThemedView style={styles.titleContainer}>
        <TreeWave />
        <ThemedText type="title">{title}</ThemedText>
        <TreeWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>{content}</ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
