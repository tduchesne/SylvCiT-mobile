import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, StyleSheet, Alert, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";

interface TreeData {
  no_emp: number;
  emplacement?: string;
  dhp?: number | null;
  latitude?: number | string;
  longitude?: number | string;
  date_measure?: string;
  date_plantation?: string;
  inv_type?: string;
  family?: string;
  genre?: string;
  functional_group?: string;
  type?: string;
}

export default function FormModifierArbre() {
  const API_URL = "http://localhost:5001";
  const colorScheme = useColorScheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(false);

  const [emplacement, setEmplacement] = useState("");
  const [dhp, setDhp] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dateReleve, setDateReleve] = useState(new Date());
  const [datePlantation, setDatePlantation] = useState("");
  const [invType, setInvType] = useState("");
  const [family, setFamily] = useState("");
  const [genre, setGenre] = useState("");
  const [functionalGroup, setFunctionalGroup] = useState("");
  const [type, setType] = useState("");
  const [modalDateReleve, setModalDateReleve] = useState(false);
  const [modalDatePlantation, setModalDatePlantation] = useState(false);

  const fetchTreeData = () => {
    if (!searchQuery) {
      Alert.alert("Veuillez entrer une valeur de recherche valide");
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/search_tree?recherche=${searchQuery}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          Alert.alert("Aucun arbre trouvé pour la valeur de recherche fournie.");
          return;
        }
        setTreeData(data[0]);
        populateFormFields(data[0]);
      })
      .catch((error) => {
        Alert.alert("Erreur de récupération des données de l'arbre", error.message);
      })
      .finally(() => setLoading(false));
  };

  const populateFormFields = (data: TreeData) => {
    setEmplacement(data.emplacement || "");
    setDhp(data.dhp ? data.dhp.toString() : "");
    setLatitude(data.latitude ? data.latitude.toString() : "");
    setLongitude(data.longitude ? data.longitude.toString() : "");
    setDateReleve(data.date_measure ? new Date(data.date_measure) : new Date());
    setDatePlantation(data.date_plantation || "");
    setInvType(data.inv_type || "");
    setFamily(data.family || "");
    setGenre(data.genre || "");
    setFunctionalGroup(data.functional_group || "");
    setType(data.type || "");
  };

  const saveTreeData = () => {
    if (!emplacement || !latitude || !longitude || !invType) {
      Alert.alert("Merci de remplir tous les champs obligatoires");
      return;
    }

    fetch(`${API_URL}/api/modifier_arbre/${treeData?.no_emp}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emplacement,
        dhp: dhp ? parseInt(dhp) : null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date_measure: formatDate(dateReleve),
        date_plantation: datePlantation,
        inv_type: invType,
        family,
        genre,
        functional_group: functionalGroup,
        type,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        Alert.alert("Les données de l'arbre ont été mises à jour avec succès.");
      })
      .catch(() => Alert.alert("Erreur lors de la mise à jour des données de l'arbre"));
  };

  const formatDate = (date: Date) => {
    const year = String(date.getFullYear()).padStart(4, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Rechercher un arbre"
          />
          <Button title="Chercher un arbre" onPress={fetchTreeData} />

          {treeData && (
            <>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setEmplacement}
                value={emplacement}
                placeholder="Emplacement"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setDhp}
                value={dhp}
                placeholder="DHP"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setLatitude}
                value={latitude}
                placeholder="Latitude"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setLongitude}
                value={longitude}
                placeholder="Longitude"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setInvType}
                value={invType}
                placeholder="Type d'inventaire (R ou H)"
              />
              <View style={styles.labelCal}>
                <ThemedText style={styles.label}>Date relevé</ThemedText>
                <Ionicons.Button name="calendar" onPress={() => setModalDateReleve(true)} />
                {modalDateReleve && (
                  <DateTimePicker
                    value={dateReleve}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      setModalDateReleve(false);
                      if (selectedDate) setDateReleve(selectedDate);
                    }}
                  />
                )}
              </View>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                editable={false}
                value={formatDate(dateReleve)}
                placeholder="Date Relevé"
              />
              <View style={styles.labelCal}>
                <ThemedText style={styles.label}>Date Plantation</ThemedText>
                <Ionicons.Button name="calendar" onPress={() => setModalDatePlantation(true)} />
                {modalDatePlantation && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    onChange={(event, selectedDate) => {
                      setModalDatePlantation(false);
                      if (selectedDate) setDatePlantation(formatDate(selectedDate));
                    }}
                  />
                )}
              </View>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                editable={false}
                value={datePlantation}
                placeholder="Date Plantation"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setFamily}
                value={family}
                placeholder="Famille"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setGenre}
                value={genre}
                placeholder="Genre"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setFunctionalGroup}
                value={functionalGroup}
                placeholder="Groupe fonctionnel"
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                onChangeText={setType}
                value={type}
                placeholder="Type"
              />
              <View style={styles.bouton}>
                <Button title="Sauvegarder" onPress={saveTreeData} />
              </View>
            </>
          )}
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
    width: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
