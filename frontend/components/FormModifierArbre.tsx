import React, { useState } from "react";
import {
  TextInput,
  SafeAreaView,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
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

interface FormModifierArbreProps {
  tree: Tree;
  onSave: (updatedTree: Tree) => void;
}

function parseDateString(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    year <= 0 ||
    month <= 0 ||
    day <= 0
  ) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function formatDate(date: Date | null): string {
  if (!date || isNaN(date.getTime())) return "";
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function FormModifierArbre({
  tree,
  onSave,
}: FormModifierArbreProps) {
  const API_URL = `${Config.API_URL}`;

  const colorScheme = useColorScheme();

  const [latitude, setLatitude] = useState(tree.location?.latitude || "");
  const [longitude, setLongitude] = useState(tree.location?.longitude || "");
  const [dhp, setDhp] = useState(tree.dhp ? tree.dhp.toString() : "");
  const [dateMeasure, setDateMeasure] = useState<Date>(
    parseDateString(tree.date_measure) || new Date()
  );
  const [datePlantation, setDatePlantation] = useState<Date>(
    parseDateString(tree.date_plantation) || new Date()
  );
  const [type, setType] = useState(tree.type?.name_fr || "");
  const [family, setFamily] = useState(tree.family?.name || "");
  const [genre, setGenre] = useState(tree.genre?.name || "");
  const [functionalGroup, setFunctionalGroup] = useState(
    tree.functional_group?.group || ""
  );
  const [modalDateMeasure, setModalDateMeasure] = useState(false);
  const [modalDatePlantation, setModalDatePlantation] = useState(false);

  const saveTreeData = () => {
    if (!latitude || !longitude) {
      Alert.alert("Merci de remplir tous les champs obligatoires");
      return;
    }

    const updatedTree: Tree = {
      ...tree,
      date_plantation: formatDate(datePlantation),
      date_measure: formatDate(dateMeasure),
      dhp: dhp ? parseInt(dhp) : null,
      type: {
        name_fr: type,
        name_en: "",
        name_la: "",
      },
      genre: {
        name: genre,
      },
      family: {
        name: family,
      },
      functional_group: {
        group: functionalGroup,
        description: tree.functional_group?.description || "",
      },
      location: {
        latitude: latitude,
        longitude: longitude,
      },
    };

    console.log("Updated tree data being sent:", updatedTree);

    fetch(`${API_URL}/api/modifier_arbre/${tree.id_tree}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTree),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert(
            "Les données de l'arbre ont été mises à jour avec succès."
          );
          onSave(updatedTree);
        } else {
          response.json().then((errorData) => {
            Alert.alert(
              "Erreur lors de la mise à jour des données de l'arbre",
              errorData.message || errorData.description || ""
            );
          });
        }
      })
      .catch(() =>
        Alert.alert("Erreur lors de la mise à jour des données de l'arbre")
      );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <ThemedText>* Les champs en rouge sont obligatoires</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
              styles.champObligatoire,
            ]}
            onChangeText={setLatitude}
            value={latitude}
            placeholder="Latitude"
          />
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
              styles.champObligatoire,
            ]}
            onChangeText={setLongitude}
            value={longitude}
            placeholder="Longitude"
          />
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            onChangeText={setDhp}
            value={dhp}
            placeholder="DHP"
            keyboardType="numeric"
          />
          <View style={styles.labelCal}>
            <ThemedText style={styles.label}>Date relevé</ThemedText>
            <Ionicons.Button
              name="calendar"
              onPress={() => setModalDateMeasure(true)}
            />
            {modalDateMeasure && (
              <DateTimePicker
                value={dateMeasure}
                mode="date"
                onChange={(event, selectedDate) => {
                  setModalDateMeasure(false);
                  if (selectedDate) setDateMeasure(selectedDate);
                }}
              />
            )}
          </View>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            editable={false}
            value={formatDate(dateMeasure)}
            placeholder="Date Relevé"
          />
          <View style={styles.labelCal}>
            <ThemedText style={styles.label}>Date Plantation</ThemedText>
            <Ionicons.Button
              name="calendar"
              onPress={() => setModalDatePlantation(true)}
            />
            {modalDatePlantation && (
              <DateTimePicker
                value={datePlantation}
                mode="date"
                onChange={(event, selectedDate) => {
                  setModalDatePlantation(false);
                  if (selectedDate) setDatePlantation(selectedDate);
                }}
              />
            )}
          </View>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            editable={false}
            value={formatDate(datePlantation)}
            placeholder="Date Plantation"
          />
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
              styles.champObligatoire,
            ]}
            onChangeText={setType}
            value={type}
            placeholder="Type (nom en français)"
          />
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            onChangeText={setFamily}
            value={family}
            placeholder="Famille"
          />
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            onChangeText={setGenre}
            value={genre}
            placeholder="Genre"
          />
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            onChangeText={setFunctionalGroup}
            value={functionalGroup}
            placeholder="Groupe fonctionnel"
          />
          <View style={styles.bouton}>
            <Button title="Sauvegarder" onPress={saveTreeData} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  champObligatoire: {
    borderColor: "red",
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
  },
  bouton: {
    padding: 10,
  },
  labelCal: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  label: {
    paddingRight: 10,
  },
});
