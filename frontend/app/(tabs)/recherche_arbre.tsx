import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image } from "react-native";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function RechercheArbre() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trees, setTrees] = useState<any[]>([]);

  const searchTrees = () => {
    // Envoie une requête à l'API Flask (ajuste l'URL si besoin)
    fetch(`http://localhost:5000/search-trees?term=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setTrees(data))
      .catch((error) => console.error("Erreur lors de la recherche", error));
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
            placeholder="Entrez un nom d'arbre..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {/* Bouton de recherche */}
          <Button title="Rechercher" onPress={searchTrees} />
          
          {/* Liste des résultats */}
          {trees.length > 0 && (
            <View style={styles.listContainer}>
              <FlatList
                data={trees}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Text style={styles.treeItem}>{item.name}</Text>}
              />
            </View>
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
  listContainer: {
    marginTop: 20,
    width: '100%',
  },
});
