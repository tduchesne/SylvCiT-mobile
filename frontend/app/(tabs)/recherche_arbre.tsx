import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image } from "react-native";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function RechercheArbre() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trees, setTrees] = useState<any[]>([]);

  const searchTrees = () => {
    // Envoie une requête à l'API Flask
    fetch(`http://192.168.0.19:5001/search-trees?term=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setTrees(data))
      .catch((error) => console.error("Erreur lors de la recherche", error));
  };

  // Fonction pour formater la date en UTC sans l'heure et sans "GMT"
  const formatDateToUTC = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Retourne uniquement la partie "YYYY-MM-DD"
  };

  return (
    <Screen
      title="Recherche d'Arbres"
      headerImage={
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.treeLogo}
        />
      }
      content={
        <ThemedView style={styles.container}>
          {/* Champ de recherche */}
          <TextInput
            style={styles.input}
            placeholder="Entrez un genre d'arbre..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {/* Bouton de recherche */}
          <Button title="Rechercher" onPress={searchTrees} />

          {/* Liste des résultats */}
          {trees.length > 0 && (
            <FlatList
              data={trees}
              keyExtractor={(item) => item.id_tree.toString()}
              renderItem={({ item }) => (
                <ThemedView style={styles.treeItem}>
                  <Text>Genre: {item.name}</Text>
                  <Text>Date de plantation: {formatDateToUTC(item.date_plantation)}</Text>
                </ThemedView>
              )}
            />
          )}
        </ThemedView>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  treeItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  treeLogo: {
    height: 230,
    width: 310,
    bottom: 0,
    left: 36,
    position: "absolute",
  },
});
