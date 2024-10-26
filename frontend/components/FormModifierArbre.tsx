import { useState } from "react";
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
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";

export default function FormModifierArbre() {
  const API_URL = "http://localhost:5001";

  const [treeId, setTreeId] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // const [adresse, setAdresse] = useState('');
  // const [essenceLatin, setEssenceLatin] = useState('');
  // const [essenceFr, setEssenceFr] = useState('');
  // const [essenceAng, setEssenceAng] = useState('');
  // const [dhp, setDhp] = useState('');
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dateReleve, setDateReleve] = useState(new Date());
  const [datePlantation, setDatePlantation] = useState("");
  const [modalDateReleve, setModalDateReleve] = useState(false);
  const [modalDatePlantation, setModalDatePlantation] = useState(false);

  const [family, setFamily] = useState("");
  const [genre, setGenre] = useState("");
  const [functionalGroup, setFunctionalGroup] = useState("");
  const [type, setType] = useState("");

  const colorScheme = useColorScheme();

  const fetchTreeData = () => {
    if (!treeId) {
      Alert.alert("Veuillez entrer un identifiant d'arbre valide");
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/api/search_tree?recherche=${treeId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          Alert.alert("Aucune arbre trouvé pour l'ID fourni.");
          return;
        }

        setTreeData(data[0]);
        populateFormFields(data[0]);
                    })
                    .catch((error) => {
                        Alert.alert(error.message);
                    })
                    .finally(() => setLoading(false));
            };

            const populateFormFields = (data: any) => {
                // setAdresse(data.adresse || '');
                // setEssenceLatin(data.essence_latin || '');
                // setEssenceFr(data.essence_fr || '');
                // setEssenceAng(data.essence_ang || '');
                // setDhp(data.dhp || '');
                setLongitude(data.location ? data.location.longitude : "");
                setLatitude(data.location ? data.location.latitude : "");
                setDateReleve(data.date_releve ? new Date(data.date_releve) : new Date());
                setDatePlantation(data.date_plantation || "");

                setFamily(data.family ? data.family.name : "");
                setGenre(data.genre ? data.genre.name : "");
                setFunctionalGroup(
                    data.functional_group ? data.functional_group.group : ""
                );
                setType(data.type ? data.type.name_fr : "");
            };

            const sauvegarder = () => {
                if (!dateReleve || !longitude || !latitude) {
                    Alert.alert("Merci de remplir tous les champs obligatoires");
                    return;
                }

                console.log("Enregistrement des données de l'arbre...");
                console.log("ID de l'arbre: ", treeId);
                // console.log("Adresse: ", adresse);
                // console.log("Essence Latin: ", essenceLatin);
                // console.log("Essence Français: ", essenceFr);
                // console.log("Essence Anglais: ", essenceAng);
                // console.log("DHP: ", dhp);
                console.log("Latitude: ", latitude);
                console.log("Longitude: ", longitude);
                console.log("Date relevé: ", formatDate(dateReleve));
                console.log("Date plantation: ", datePlantation);
                console.log("Famille: ", family);
                console.log("Genre: ", genre);
                console.log("Groupe fonctionnel: ", functionalGroup);
                console.log("Type: ", type);

                fetch(`${API_URL}/api/modifier_arbre/${treeId}`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // adresse: adresse,
                        // essence_latin: essenceLatin,
                        // essence_fr: essenceFr,
                        // essence_ang: essenceAng,
                        // dhp: dhp,
                        date_plantation: datePlantation,
                        latitude: latitude,
                        longitude: longitude,
                        date_releve: formatDate(dateReleve),
                        family: family,
                        genre: genre,
                        functional_group: functionalGroup,
                        type: type,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        Alert.alert("Données de l'arbre mises à jour");
                    })
                    .catch(() =>
                        Alert.alert("Erreur lors de la mise à jour des données de l'arbre")
                    );
            };

            const supprimerArbre = () => {
                if (!treeId) {
                    Alert.alert(
                        "Veuillez entrer un identifiant d'arbre valide avant de supprimer"
                    );
                    return;
                }

                fetch(`${API_URL}/api/delete_tree/${treeId}`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message === "Arbre supprimé") {
                            Alert.alert("Arbre supprimé avec succès");
                            setTreeData(null);
                            setTreeId("");
                        } else {
                            Alert.alert("Erreur lors de la suppression de l'arbre");
                        }
                    })
                    .catch(() => Alert.alert("Erreur lors de la suppression de l'arbre"));
            };

            const choisirDateReleve = (event: any, dateReleveChoisie: any) => {
                setModalDateReleve(false);
                setDateReleve(dateReleveChoisie);
            };

            const choisirDatePlantation = (event: any, datePlantationChoisie: any) => {
                setModalDatePlantation(false);
                setDatePlantation(formatDate(datePlantationChoisie));
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
                                onChangeText={setTreeId}
                                value={treeId}
                                placeholder="ID Arbre"
                                keyboardType="numeric"
                            />
                            <Button title="Chercher un arbre" onPress={fetchTreeData} />

                            {treeData && (
                                <>
                                    {/* <TextInput
                                                                        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                                                                        onChangeText={setAdresse}
                                                                        value={adresse || ''}
                                                                        placeholder="Adresse"
                                                                />
                                                                <TextInput
                                                                        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                                                                        onChangeText={setEssenceLatin}
                                                                        value={essenceLatin || ''}
                                                                        placeholder="Essence Latin"
                                                                />
                                                                <TextInput
                                                                        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                                                                        onChangeText={setEssenceFr}
                                                                        value={essenceFr || ''}
                                                                        placeholder="Essence Français"
                                                                />
                                                                <TextInput
                                                                        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                                                                        onChangeText={setEssenceAng}
                                                                        value={essenceAng || ''}
                                                                        placeholder="Essence Anglais"
                                                                />
                                                                <TextInput
                                                                        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
                                                                        onChangeText={setDhp}
                                                                        value={dhp ? dhp.toString() : ''}
                                                                        placeholder="DHP"
                                                                        keyboardType="numeric"
                                                                /> */}
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                        ]}
                                        onChangeText={setFamily}
                                        value={family || ""}
                                        placeholder="Famille"
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                        ]}
                                        onChangeText={setGenre}
                                        value={genre || ""}
                                        placeholder="Genre"
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                        ]}
                                        onChangeText={setFunctionalGroup}
                                        value={functionalGroup || ""}
                                        placeholder="Groupe fonctionnel"
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                        ]}
                                        onChangeText={setType}
                                        value={type || ""}
                                        placeholder="Type"
                                    />
                                    <View style={styles.labelCal}>
                                        <ThemedText style={styles.label}>Date relevé</ThemedText>
                                        <Ionicons.Button
                                            name="calendar"
                                            onPress={() => setModalDateReleve(true)}
                                        />
                                        {modalDateReleve && (
                                            <DateTimePicker
                                                value={dateReleve}
                                                mode={"date"}
                                                onChange={choisirDateReleve}
                                            />
                                        )}
                                    </View>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                        ]}
                                        editable={false}
                                        value={formatDate(dateReleve)}
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
                                                value={new Date()}
                                                mode={"date"}
                                                onChange={choisirDatePlantation}
                                            />
                                        )}
                                    </View>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                        ]}
                                        editable={false}
                                        value={datePlantation || ""}
                                        placeholder="Date Plantation"
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                            styles.champObligatoire,
                                        ]}
                                        onChangeText={setLongitude}
                                        value={longitude ? longitude.toString() : ""}
                                        placeholder="Longitude"
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { color: Colors[colorScheme ?? "light"].text },
                                            styles.champObligatoire,
                                        ]}
                                        onChangeText={setLatitude}
                                        value={latitude ? latitude.toString() : ""}
                                        placeholder="Latitude"
                                        keyboardType="numeric"
                                    />
                                    <View style={styles.bouton}>
                                        <Button title="Sauvegarder" onPress={sauvegarder} />
                                    </View>

                                    <View style={styles.bouton}>
                                        <Button
                                            title="Supprimer"
                                            color="red"
                                            onPress={supprimerArbre}
                                        />
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
