import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface Tree {
  id: number;
  no_emp: number;
  emplacement: string;
  essence?: { fr: string };
}

export default function FormDemandeSuppressionArbres() {
  const API_URL = "http://localhost:5001";
  const [trees, setTrees] = useState<Tree[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<Set<number>>(new Set());
  const [selectedTrees, setSelectedTrees] = useState<Set<number>>(new Set());

  const fetchTrees = () => {
    fetch(`${API_URL}/api/trees`, {
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

  const fetchPendingDeletions = () => {
    fetch(`${API_URL}/api/trees_pending_deletion`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const pendingSet = new Set<number>(data.map((tree: Tree) => tree.no_emp));
        setPendingDeletions(pendingSet);
      })
      .catch(() => Alert.alert("Erreur lors du chargement des demandes de suppression"));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTrees();
      fetchPendingDeletions();
    }, [])
  );

  const handleSelectTree = (no_emp: number) => {
    if (pendingDeletions.has(no_emp)) {
      Alert.alert("Cet arbre est déjà en demande de suppression.");
      return;
    }
    setSelectedTrees((prev) => {
      const updated: Set<number> = new Set(prev);
      if (updated.has(no_emp)) {
        updated.delete(no_emp);
      } else {
        updated.add(no_emp);
      }
      return updated;
    });
  };

  const requestDeletion = () => {
    Promise.all(
      Array.from(selectedTrees).map((no_emp) =>
        fetch(`${API_URL}/api/demande_suppression/${no_emp}`, {
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
          Alert.alert("Demande de suppression envoyée pour les arbres sélectionnés");
          fetchTrees();
          fetchPendingDeletions();
          setSelectedTrees(new Set());
        } else {
          Alert.alert("Erreur lors de la demande de suppression");
        }
      })
      .catch(() => Alert.alert("Erreur lors de la demande de suppression"));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Sélectionnez les arbres à demander pour suppression</Text>
      {trees.map((item) => (
        <TouchableOpacity
          key={item.no_emp}
          style={[
            styles.treeItem,
            selectedTrees.has(item.no_emp) ? styles.selected : null,
            pendingDeletions.has(item.no_emp) ? styles.pending : null,
          ]}
          onPress={() => handleSelectTree(item.no_emp)}
          disabled={pendingDeletions.has(item.no_emp)}
        >
          <Text style={styles.treeText}>ID: {item.id}</Text>
          <Text style={styles.treeText}>Numéro emplacement: {item.no_emp}</Text>
          <Text style={styles.treeText}>Emplacement: {item.emplacement}</Text>
          {item.essence?.fr && <Text style={styles.treeText}>Nom Français: {item.essence.fr}</Text>}
          {pendingDeletions.has(item.no_emp) && <Text style={styles.pendingText}>En demande de suppression</Text>}
        </TouchableOpacity>
      ))}
      {selectedTrees.size > 0 && (
        <Button title="Demander la suppression des arbres sélectionnés" onPress={requestDeletion} />
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
  pending: {
    backgroundColor: "#fffae6",
    borderColor: "#ffcc00",
  },
  treeText: {
    fontSize: 16,
  },
  pendingText: {
    fontSize: 14,
    color: "#cc8400",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 8,
  },
});
