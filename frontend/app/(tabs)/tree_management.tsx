import React from "react";
import { Image, StyleSheet } from "react-native";
import TreeManagement from "@/components/TreeManagement";
import Screen from "@/components/Screen";

export default function GestionArbres() {
  return (
    <Screen
      title="Gestion des Arbres"
      content={<TreeManagement />}
      headerImage={
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.treeLogo}
        />
      }
    />
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
