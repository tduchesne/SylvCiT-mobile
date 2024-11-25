import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FormModifierArbre from "./FormModifierArbre";
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
    description?: string;
  };
  location?: {
    latitude: string;
    longitude: string;
  };
}

export default function TreeManagement() {
  const API_URL = `${Config.API_URL}`;
  const [trees, setTrees] = useState<Tree[]>([]);
  const [editingTree, setEditingTree] = useState<Tree | null>(null);

  const fetchTrees = () => {
    fetch(`${API_URL}/api/list_trees`, {
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
    React.useCallback(() => {
      fetchTrees();
    }, [])
  );

  const handleSelectTree = (tree: Tree) => {
    Alert.alert(
      `Arbre ID: ${tree.id_tree}`,
      "Que souhaitez-vous faire ?",
      [
        {
          text: "Modifier",
          onPress: () => setEditingTree(tree),
        },
        {
          text: "Demander la suppression",
          onPress: () => requestDeletion(tree),
          style: "destructive",
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const requestDeletion = (tree: Tree) => {
    if (tree.approbation_status === "rejected") {
      Alert.alert("Cet arbre est déjà en demande de suppression.");
      return;
    }

    fetch(`${API_URL}/api/demande_suppression/${tree.id_tree}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert("Demande de suppression envoyée");
          setTrees((prevTrees) =>
            prevTrees.map((t) =>
              t.id_tree === tree.id_tree ? { ...t, approbation_status: "rejected" } : t
            )
          );
        } else {
          Alert.alert("Erreur lors de la demande de suppression");
        }
      })
      .catch(() => Alert.alert("Erreur lors de la demande de suppression"));
  };

  return (
    <View style={styles.container}>
      {!editingTree ? (
        <>
          <Text style={styles.headerText}>Liste des arbres</Text>
          <ScrollView>
            {trees.map((tree) => (
              <TouchableOpacity
                key={tree.id_tree}
                style={[
                  styles.treeItem,
                  tree.approbation_status === "rejected" && styles.rejectedTree,
                ]}
                onPress={() => handleSelectTree(tree)}
              >
                <Text style={styles.treeText}>ID: {tree.id_tree}</Text>
                <Text style={styles.treeText}>
                  Date Mesure: {tree.date_measure || "N/A"}
                </Text>
                <Text style={styles.treeText}>
                  DHP: {tree.dhp !== null ? tree.dhp : "N/A"}
                </Text>
                {tree.type && (
                  <Text style={styles.treeText}>Type: {tree.type.name_fr}</Text>
                )}
                {tree.genre && (
                  <Text style={styles.treeText}>Genre: {tree.genre.name}</Text>
                )}
                {tree.family && (
                  <Text style={styles.treeText}>
                    Famille: {tree.family.name}
                  </Text>
                )}
                <Text style={styles.treeText}>
                  Statut: {tree.approbation_status}
                </Text>
                {tree.approbation_status === "rejected" && (
                  <Text style={styles.rejectedMessage}>
                    En demande de suppression
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.modalContent}>
          <FormModifierArbre
            tree={editingTree}
            onSave={(updatedTree) => {
              setTrees((prevTrees) =>
                prevTrees.map((t) =>
                  t.id_tree === updatedTree.id_tree ? updatedTree : t
                )
              );
              setEditingTree(null);
            }}
          />
          <Button title="Annuler" onPress={() => setEditingTree(null)} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  treeItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  treeText: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  rejectedTree: {
    backgroundColor: "#fffbea",
    borderColor: "#ffcc00",
  },
  rejectedMessage: {
    marginTop: 8,
    fontSize: 14,
    color: "#cc8400",
  },
});
