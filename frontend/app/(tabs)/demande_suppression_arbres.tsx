import React from "react";
import { Image, StyleSheet, View } from "react-native";
import FormDemandeSuppressionArbres from "@/components/FormDemandeSuppressionArbres";
import Screen from "@/components/Screen";

export default function DemandeSuppressionArbres() {
  return (
    <Screen
      title="Demande de Suppression"
      content={<FormDemandeSuppressionArbres />}
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
