import { Image, StyleSheet } from "react-native";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";

export default function HomeScreen() {
  return (
    <Screen
      title="SylvCiT"
      content={
        <ThemedView style={styles.container}>
          <ThemedText type="default" style={styles.paragraph}>
            Bienvenue! SylvCiT est une application innovante conçue pour transformer la manière dont nous interagissons avec la nature en milieu urbain. Imaginez une carte interactive, semblable à Google Maps, mais exclusivement dédiée aux arbres. Avec SylvCiT, vous pouvez :
          </ThemedText>
          <ThemedView style={styles.list}>
            <ThemedText type="default" style={styles.listItem}>
              • Recenser des arbres : Contribuez à la création d'une base de données géolocalisée pour suivre et documenter la diversité arboricole.
            </ThemedText>
            <ThemedText type="default" style={styles.listItem}>
              • Ajouter des arbres : Capturez des informations détaillées sur chaque arbre, y compris sa localisation, ses caractéristiques, et même une photo.
            </ThemedText>
            <ThemedText type="default" style={styles.listItem}>
              • Lister et filtrer les données : Recherchez des arbres en fonction de critères spécifiques pour faciliter vos études ou vos explorations.
            </ThemedText>
            <ThemedText type="default" style={styles.listItem}>
              • Prendre des photos : Associez des images pour enrichir les profils d'arbres et documenter leur état actuel.
            </ThemedText>
          </ThemedView>
          <ThemedText type="default" style={styles.paragraph}>
            Destinée aux chercheurs, étudiants et professionnels de l’environnement, SylvCiT offre un outil puissant pour explorer, enrichir et protéger notre patrimoine naturel. Ensemble, contribuons à bâtir un avenir plus vert, une donnée à la fois.
          </ThemedText>
          <ThemedText type="default" style={styles.footer}>
            Commencez dès maintenant à découvrir et à enrichir la carte de SylvCiT ! 🌳
          </ThemedText>
        </ThemedView>
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
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
  },
  listItem: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 16,
    fontStyle: 'italic',
  },
  treeLogo: {
    height: 230,
    width: 310,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -155 }, { translateY: -115 }],
  },
});
