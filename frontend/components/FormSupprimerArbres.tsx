import React, { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface Tree {
    id: number;
  no_emp: number;
  emplacement: string;
  essence?: { fr: string };
}

export default function FormSupprimerArbres() {
  const API_URL = "http://localhost:5001";
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<Set<number>>(new Set());

  const fetchTrees = () => {
    fetch(`${API_URL}/api/trees_pending_deletion`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setTrees(data))
      .catch(() => Alert.alert("Erreur lors du chargement des arbres"));
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrees();
    }, [])
  );

  const handleSelectTree = (no_emp: number) => {
    setSelectedTrees((prev) => {
      const updated = new Set(prev);
      if (updated.has(no_emp)) {
        updated.delete(no_emp);
      } else {
        updated.add(no_emp);
      }
      return updated;
    });
  };

  const deleteTrees = () => {
    Alert.alert(
      "Confirmation de suppression",
      "Voulez-vous supprimer les arbres sélectionnés ou refuser leur suppression ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Refuser",
          style: "default",
          onPress: () => {
            Promise.all(
              Array.from(selectedTrees).map((no_emp) =>
                fetch(`${API_URL}/api/refuse_deletion/${no_emp}`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                })
              )
            )
              .then((responses) => {
                const successResponses = responses.filter((res) => res.ok);
                if (successResponses.length > 0) {
                  Alert.alert("Demande de suppression refusée pour les arbres sélectionnés");
                  fetchTrees();
                  setSelectedTrees(new Set());
                } else {
                  Alert.alert("Erreur lors du refus de la demande de suppression");
                }
              })
              .catch(() => Alert.alert("Erreur lors du refus de la demande de suppression"));
          },
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Promise.all(
              Array.from(selectedTrees).map((no_emp) =>
                fetch(`${API_URL}/api/delete_tree/${no_emp}`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                })
              )
            )
              .then((responses) => {
                const successResponses = responses.filter((res) => res.ok);
                if (successResponses.length > 0) {
                  Alert.alert("Arbres sélectionnés supprimés avec succès");
                  fetchTrees();
                  setSelectedTrees(new Set());
                } else {
                  Alert.alert("Erreur lors de la suppression des arbres");
                }
              })
              .catch(() => Alert.alert("Erreur lors de la suppression des arbres"));
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Sélectionnez les arbres à supprimer ou refuser</Text>
      {trees.map((item) => (
        <TouchableOpacity
          key={item.no_emp}
          style={[
            styles.treeItem,
            selectedTrees.has(item.no_emp) ? styles.selected : null,
          ]}
          onPress={() => handleSelectTree(item.no_emp)}
        >
            <Text style={styles.treeText}>ID: {item.id}</Text>
          <Text style={styles.treeText}>Numéro emplacement: {item.no_emp}</Text>
          <Text style={styles.treeText}>Emplacement: {item.emplacement}</Text>
          {item.essence?.fr && <Text style={styles.treeText}>Nom Français: {item.essence.fr}</Text>}
        </TouchableOpacity>
      ))}
      {selectedTrees.size > 0 && (
        <Button title="Demander la suppression ou refus" onPress={deleteTrees} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  treeItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selected: {
    backgroundColor: "#ffdddd",
  },
  treeText: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 8,
  },
});
