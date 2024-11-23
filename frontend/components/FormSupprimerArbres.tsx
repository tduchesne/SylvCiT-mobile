import React, { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Config from '../config';


interface Tree {
  id_tree: number;
  date_plantation: string | null;
  date_measure: string | null;
  approbation_status: string;
  details_url: string;
  image_url: string;
  dhp: number | null;
  type?: {
    name_fr: string;
    name_en: string;
    name_la: string;
  };
  genre?: {
    name: string;
  };
  family?: {
    name: string;
  };
  functional_group?: {
    group: string;
    description: string;
  };
  location?: {
    latitude: string;
    longitude: string;
  };
}

export default function FormSupprimerArbres() {
  const API_URL = `${Config.API_URL}`;
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<Set<number>>(new Set());

  const fetchTrees = () => {
    fetch(`${API_URL}/api/arbre_rejet`, {
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

  const handleSelectTree = (id_tree: number) => {
    setSelectedTrees((prev) => {
      const updated = new Set(prev);
      if (updated.has(id_tree)) {
        updated.delete(id_tree);
      } else {
        updated.add(id_tree);
      }
      return updated;
    });
  };

  const handleDeletionAction = () => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous approuver ou refuser la suppression des arbres sélectionnés ?",
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
              Array.from(selectedTrees).map((id_tree) =>
                fetch(`${API_URL}/api/refuse_deletion/${id_tree}`, {
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
          text: "Approuver",
          style: "destructive",
          onPress: () => {
            Promise.all(
              Array.from(selectedTrees).map((id_tree) =>
                fetch(`${API_URL}/api/approve_deletion/${id_tree}`, {
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
      <Text style={styles.headerText}>Sélectionnez les arbres à approuver ou refuser</Text>
      {trees.map((item) => (
        <TouchableOpacity
          key={item.id_tree}
          style={[
            styles.treeItem,
            selectedTrees.has(item.id_tree) ? styles.selected : null,
          ]}
          onPress={() => handleSelectTree(item.id_tree)}
        >
          <Text style={styles.treeText}>ID: {item.id_tree}</Text>
          <Text style={styles.treeText}>Date Mesure: {item.date_measure || "N/A"}</Text>
          <Text style={styles.treeText}>DHP: {item.dhp !== null ? item.dhp : "N/A"}</Text>
          {item.type && <Text style={styles.treeText}>Type: {item.type.name_fr}</Text>}
          {item.genre && <Text style={styles.treeText}>Genre: {item.genre.name}</Text>}
          {item.family && <Text style={styles.treeText}>Famille: {item.family.name}</Text>}
          <Text style={styles.treeText}>Statut: {item.approbation_status}</Text>
        </TouchableOpacity>
      ))}
      {selectedTrees.size > 0 && (
        <Button title="Approuver ou Refuser la suppression" onPress={handleDeletionAction} />
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
