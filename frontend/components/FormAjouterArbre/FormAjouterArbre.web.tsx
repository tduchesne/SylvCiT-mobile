import React, { useState, useEffect } from "react";
import {
  TextInput,
  SafeAreaView,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

let MapContainer, TileLayer, Marker, useMap, useMapEvents, Icon;

if (typeof window !== "undefined") {
  const ReactLeaflet = require("react-leaflet");
  MapContainer = ReactLeaflet.MapContainer;
  TileLayer = ReactLeaflet.TileLayer;
  Marker = ReactLeaflet.Marker;
  useMap = ReactLeaflet.useMap;
  useMapEvents = ReactLeaflet.useMapEvents;
  Icon = require("leaflet").Icon;
  require("leaflet/dist/leaflet.css");

  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

export default function FormAjoutArbre() {
  const [empNo, setEmpNo] = useState("");
  const [longitude, setLongitude] = useState(-73.57561111450197);
  const [latitude, setLatitude] = useState(45.498406179029786);
  const [adresse, setAdresse] = useState("");
  const [dhp, setDhp] = useState("");
  const [indicateur, setIndicateur] = useState(false);
  const [genreChoisi, setGenreChoisi] = useState("");
  const [typeChoisiFR, setTypeChoisiFR] = useState("");
  const [functionalGroupChoisi, setFunctionalGroupChoisi] = useState("");
  const [familyChoisi, setFamilyChoisi] = useState("");
  const [dateReleve, setDateReleve] = useState(new Date());
  const [datePlantation, setDatePlantation] = useState("");
  const [genres, setGenres] = useState([]);
  const [types, setTypes] = useState([]);
  const [functionalGroups, setFunctionalGroups] = useState([]);
  const [families, setFamilies] = useState([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchGenres();
    fetchTypes();
    fetchFunctionalGroups();
    fetchFamilies();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch(`/api/genre`);
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des genres :", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await fetch(`/api/type`);
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des types :", error);
    }
  };

  const fetchFunctionalGroups = async () => {
    try {
      const response = await fetch(`/api/functional_group`);
      const data = await response.json();
      setFunctionalGroups(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des groupes fonctionnels :",
        error
      );
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await fetch(`/api/family`);
      const data = await response.json();
      setFamilies(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des familles :", error);
    }
  };

  const trouverPosition = async () => {
    setIndicateur(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setIndicateur(false);
          },
          (error) => {
            Alert.alert(
              "Erreur",
              "Impossible de récupérer votre position GPS."
            );
            console.error(error);
            setIndicateur(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        Alert.alert(
          "Erreur",
          "La géolocalisation n'est pas supportée par ce navigateur."
        );
        setIndicateur(false);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la localisation.");
      console.error(error);
      setIndicateur(false);
    }
  };

  function MapEventHandler() {
    const map = useMap();

    useEffect(() => {
      map.flyTo([latitude, longitude], map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }, [latitude, longitude]);

    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    return null;
  }

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/685/685025.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <SafeAreaView>
      <ActivityIndicator
        size="large"
        color="#00ff00"
        animating={indicateur}
        style={[styles.indicateur]}
      />
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={setEmpNo}
            value={empNo}
            placeholder="No emplacement"
            keyboardType="numeric"
          />

          {/* Dropdowns */}
          <select
            style={styles.dropdown}
            value={genreChoisi}
            onChange={(e) => setGenreChoisi(e.target.value)}
          >
            <option value="">Choisir un genre</option>
            {genres.map((genre) => (
              <option key={genre.id_genre} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
          <select
            style={styles.dropdown}
            value={typeChoisiFR}
            onChange={(e) => setTypeChoisiFR(e.target.value)}
          >
            <option value="">Choisir un type FR</option>
            {types.map((type) => (
              <option key={type.id_type} value={type.name_fr}>
                {type.name_fr}
              </option>
            ))}
          </select>

          <select
            style={styles.dropdown}
            value={functionalGroupChoisi}
            onChange={(e) => setFunctionalGroupChoisi(e.target.value)}
          >
            <option value="">Choisir un groupe fonctionnel</option>
            {functionalGroups.map((group) => (
              <option key={group.id_functional_group} value={group.group}>
                {group.group}
              </option>
            ))}
          </select>

          <select
            style={styles.dropdown}
            value={familyChoisi}
            onChange={(e) => setFamilyChoisi(e.target.value)}
          >
            <option value="">Choisir une famille</option>
            {families.map((family) => (
              <option key={family.id_family} value={family.name}>
                {family.name}
              </option>
            ))}
          </select>

          {/* DHP */}
          <TextInput
            style={styles.input}
            onChangeText={setDhp}
            value={dhp}
            placeholder="DHP"
            keyboardType="numeric"
          />

          <div style={styles.datePickerContainer}>
            <label style={styles.datePickerLabel}>Date relevé</label>
            <input
              type="date"
              value={dateReleve.toISOString().substring(0, 10)}
              onChange={(e) => setDateReleve(new Date(e.target.value))}
              style={styles.datePickerInput}
            />
          </div>

          <div style={styles.datePickerContainer}>
            <label style={styles.datePickerLabel}>Date de plantation</label>
            <input
              type="date"
              value={
                datePlantation
                  ? datePlantation.toISOString().substring(0, 10)
                  : ""
              }
              onChange={(e) => setDatePlantation(new Date(e.target.value))}
              style={styles.datePickerInput}
            />
          </div>

          {/* Map */}
          {typeof window !== "undefined" && MapContainer && (
            <View style={styles.mapContainer}>
              <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]} icon={customIcon} />
                <MapEventHandler />
              </MapContainer>
              <Ionicons
                name="locate"
                size={30}
                color="blue"
                style={styles.locateButton}
                onPress={trouverPosition}
              />
            </View>
          )}

          {/* Coordinates */}
          <TextInput
            style={styles.input}
            onChangeText={(value) => setLongitude(Number(value))}
            value={longitude.toString()}
            placeholder="Longitude"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={(value) => setLatitude(Number(value))}
            value={latitude.toString()}
            placeholder="Latitude"
            keyboardType="numeric"
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Sauvegarder"
              color="#4CAF50"
              onPress={() => Alert.alert("Sauvegarder Pressed")}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Annuler"
              color="#f44336"
              onPress={() => Alert.alert("Annuler Pressed")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    margin: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
    maxWidth: 400,
  },
  dropdown: {
    height: 40,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "100%",
    maxWidth: 400,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  datePickerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    marginBottom: 15,
  },
  datePickerLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    flex: 1,
  },
  datePickerInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 2,
    marginLeft: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: "100%",
    maxWidth: 400,
  },
  mapContainer: {
    position: "relative",
    marginBottom: 20,
    width: "100%",
    maxWidth: 600,
    borderRadius: 5,
    overflow: "hidden",
  },
  locateButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
  },
});
