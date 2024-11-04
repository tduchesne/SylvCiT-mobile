import React, { useState } from "react";
import { TextInput, Button, FlatList, Text, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/ThemedView"; // Toujours utiliser ThemedView pour garder la thématique
import Config from '../../config';

export default function RechercheArbre() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trees, setTrees] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fonction pour gérer le timeout
  function timeout(ms: number, promise: Promise<Response>) {
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, ms);

      promise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  // Fonction de recherche des arbres via le backend
  const searchTrees = () => {
    setErrorMessage(null); // Réinitialise l'erreur avant chaque nouvelle recherche
    setTrees([]); // Réinitialise les résultats

    if (!searchTerm.trim()) {
      setErrorMessage("Veuillez entrer un terme de recherche.");
      return;
    }

    timeout(
      5000, // Timeout de 5 secondes
      fetch(`${Config.API_URL}/api/search_tree?recherche=${searchTerm}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    )
      .then((response: Response) => {
        if (response.status === 400) {
          // Si la réponse a un statut 400, on affiche le message d'erreur retourné par le backend
          return response.json().then((data: { message: string }) => {
            setErrorMessage(data.message);
          });
        } else if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }
        return response.json();
      })
      .then((data: any[]) => setTrees(data))
      .catch((error: Error) => {
        setErrorMessage(error.message === "Request timed out" ? "Le délai de la requête a expiré. Veuillez réessayer." : "Erreur réseau : " + error.message);
      });
  };

  return (
    <ThemedView style={styles.container}>
      {/* En-tête */}
      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.treeLogo}
        />
        <Text style={styles.headerTitle}>Recherche d'Arbres</Text>
      </View>

      {/* Champ de recherche */}
      <TextInput
        style={styles.input}
        placeholder="Entrez une essence d'arbre..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Bouton de recherche */}
      <Button title="Rechercher" onPress={searchTrees} />

      {/* Affichage du message d'erreur retourné par le backend en cas de code 400 */}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      {/* Liste des résultats */}
      {trees.length > 0 && (
        <FlatList
          data={trees}
          keyExtractor={(item) => item.no_emp.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.treeItem} onPress={() => console.log("Clic sur arbre", item.no_emp)}>
              <Text>Essence Latin: {item.essence_latin?.essence_latin || 'Non spécifié'}</Text>
              <Text>Essence Français: {item.essence_latin?.essence_fr || 'Non spécifié'}</Text>
              <Text>Essence Anglais: {item.essence_latin?.essence_en || 'Non spécifié'}</Text>
              <Text>Sigle: {item.essence_latin?.sigle || 'Non spécifié'}</Text>
              <Text>Emplacement: {item.emplacement || 'Non spécifié'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
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
    height: 150,
    width: 150,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    marginBottom: 20,
  },
});
