import FormModifierArbre from "@/components/FormModifierArbre";
import Screen from "@/components/Screen";
import React from "react";
import { Image, StyleSheet } from 'react-native';

export default function ModifierArbre() {
  return (
    <Screen
      title="Modifications"
      content={
        <FormModifierArbre />
      } 
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
