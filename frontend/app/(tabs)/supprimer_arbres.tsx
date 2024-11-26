import React from "react";
import { Image, StyleSheet, View } from "react-native";
import FormSupprimerArbres from "@/components/FormSupprimerArbres";
import Screen from "@/components/Screen";

export default function SupprimerArbres() {
  return (
    <Screen
      title="Supprimer Arbres"
      content={<FormSupprimerArbres />}
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -155 }, { translateY: -115 }],
  },
});
