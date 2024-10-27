import React, { useState } from "react";
import Screen from "@/components/Screen";
import { StyleSheet, TextInput, Modal, FlatList, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// mock tree list to test filters. remove when implementing back-end call
const treeList = [
    {
        essence_latin: "Quercus robur",
        essence_ang: "English Oak",
        essence_fr: "Chêne pédonculé",
        date_plantation: "2015-04-10",
        arrondissement: "Montréal",
        dhp: 35,
        date_releve: "2023-05-12",
      },
      {
        essence_latin: "Acer saccharum",
        essence_ang: "Sugar Maple",
        essence_fr: "Érable à sucre",
        date_plantation: "2010-06-15",
        arrondissement: "Laval",
        dhp: 42,
        date_releve: "2023-06-01",
      },
      {
        essence_latin: "Picea abies",
        essence_ang: "Norway Spruce",
        essence_fr: "Épinette de Norvège",
        date_plantation: "2018-09-30",
        arrondissement: "Québec City",
        dhp: 30,
        date_releve: "2023-07-15",
      },
      {
        essence_latin: "Quercus robur",
        essence_ang: "English Oak",
        essence_fr: "Chêne pédonculé",
        date_plantation: "2015-04-10",
        arrondissement: "Montréal",
        dhp: 35,
        date_releve: "2023-05-10",
      },
      {
        essence_latin: "Pinus strobus",
        essence_ang: "Eastern White Pine",
        essence_fr: "Pin blanc",
        date_plantation: "2012-03-21",
        arrondissement: "Gatineau",
        dhp: 38,
        date_releve: "2023-04-22",
      },
      {
        essence_latin: "Acer saccharum",
        essence_ang: "Sugar Maple",
        essence_fr: "Érable à sucre",
        date_plantation: "2010-06-15",
        arrondissement: "Laval",
        dhp: 42,
        date_releve: "2023-06-05",
      },
      {
        essence_latin: "Betula papyrifera",
        essence_ang: "Paper Birch",
        essence_fr: "Bouleau à papier",
        date_plantation: "2014-10-05",
        arrondissement: "Montréal",
        dhp: 29,
        date_releve: "2023-08-14",
      },
      {
        essence_latin: "Fagus sylvatica",
        essence_ang: "European Beech",
        essence_fr: "Hêtre commun",
        date_plantation: "2013-08-19",
        arrondissement: "Gatineau",
        dhp: 37,
        date_releve: "2023-09-17",
      },
      {
        essence_latin: "Pinus strobus",
        essence_ang: "Eastern White Pine",
        essence_fr: "Pin blanc",
        date_plantation: "2012-03-21",
        arrondissement: "Gatineau",
        dhp: 38,
        date_releve: "2023-04-20",
      },
      {
        essence_latin: "Thuja occidentalis",
        essence_ang: "Northern White Cedar",
        essence_fr: "Thuya occidental",
        date_plantation: "2016-12-05",
        arrondissement: "Québec City",
        dhp: 27,
        date_releve: "2023-07-21",
      },
];

interface Tree {
  essence_latin: string;
  essence_ang: string;
  essence_fr: string;
  date_plantation: string;
  arrondissement: string;
  dhp: number;
  date_releve: string;
}

export default function TabTwoScreen() {
  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDHP, setSelectedDHP] = useState("");
  const [sortedTrees, setSortedTrees] = useState(treeList);
  const [showBox] = useState(true);

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const uniqueYears = [...new Set(treeList.map(tree => parseInt(tree.date_plantation.split("-")[0])))].sort((a, b) => a - b).map(year => year.toString());
  const uniqueSpecies = [...new Set(treeList.map(tree => tree.essence_latin))].sort();
  const uniqueRegions = [...new Set(treeList.map(tree => tree.arrondissement))].sort();
  const uniqueDHPRanges = () => {
    const dhpIntervals = 5;
    const dhpValues = treeList.map(tree => tree.dhp);
    const minDHP = Math.min(...dhpValues);
    const maxDHP = Math.max(...dhpValues);
    const ranges = [];
    for (let i = Math.floor(minDHP / dhpIntervals) * dhpIntervals; i <= maxDHP; i += dhpIntervals) {
      ranges.push(`${i}-${i + dhpIntervals}`);
    }
    return ranges.sort((a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]));
  };

  const applyFilters = () => {
    let filteredData = [...treeList];
    if (selectedYear) filteredData = filteredData.filter(tree => tree.date_plantation.startsWith(selectedYear));
    if (selectedSpecies) filteredData = filteredData.filter(tree => tree.essence_latin === selectedSpecies);
    if (selectedRegion) filteredData = filteredData.filter(tree => tree.arrondissement === selectedRegion);
    if (selectedDHP) {
      const [minDHP, maxDHP] = selectedDHP.split("-").map(Number);
      filteredData = filteredData.filter(tree => tree.dhp >= minDHP && tree.dhp < maxDHP);
    }
    setSortedTrees(filteredData);
    closeFilterModal();
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedSpecies("");
    setSelectedRegion("");
    setSelectedDHP("");
    setSortedTrees(treeList);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Screen
        title="Données à valider"
        content={
          <ThemedView style={styles.container}>
            <ThemedView style={styles.searchBar}>
              <Pressable onPress={openFilterModal}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{ opacity: isPressed ? 0.5 : 1 }}>

                <Ionicons name="options-outline" size={24} color="gray" style={styles.filterIcon} />
              </Pressable>
              <TextInput
                style={styles.searchInput}
                placeholder="Entrer un mot-clé"
                placeholderTextColor="gray"
                value={searchText}
                onChangeText={setSearchText}
              />
              <Ionicons name="search-outline" size={24} color="gray" style={styles.searchIcon} />
            </ThemedView>

            <Modal visible={filterModalVisible} transparent={true} animationType="slide">
              <ThemedView style={styles.modalBackground}>
                <ThemedView style={styles.modalContent}>
                  <ThemedText style={styles.modalTitle}>Filtrer les Arbres</ThemedText>
                  {[
                    { label: "Date de plantation (Année)", value: selectedYear, options: uniqueYears, setter: setSelectedYear },
                    { label: "Espèce", value: selectedSpecies, options: uniqueSpecies, setter: setSelectedSpecies },
                    { label: "Région", value: selectedRegion, options: uniqueRegions, setter: setSelectedRegion },
                    { label: "DHP (Diamètre à la Hauteur Poitrine)", value: selectedDHP, options: uniqueDHPRanges(), setter: setSelectedDHP }
                  ].map(({ label, value, options, setter }, index) => (
                    <ThemedView style={styles.row} key={index}>
                      <ThemedText style={styles.filterLabel}>{label}</ThemedText>
                      <Picker selectedValue={value} onValueChange={(val) => setter(val)} style={styles.picker}>
                        <Picker.Item label={`Sélectionner une option`} value="" />
                          {options.map((option, idx) => (
                          <Picker.Item key={idx} label={option} value={option} />

                          ))}
                      </Picker>
                      
                    </ThemedView>
                  ))}
                  <Pressable onPress={applyFilters}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [
                      styles.applyButton,
                      { opacity: pressed ? 0.5 : 1 }
                    ]}>
                    <ThemedText style={styles.buttonText}>Apply Filters</ThemedText>
                  </Pressable>
                  <Pressable onPress={clearFilters} 
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [
                      styles.clearButton,
                      { opacity: pressed ? 0.5 : 1 }
                    ]}>
                    <ThemedText style={styles.buttonText}>Clear Filters</ThemedText>
                  </Pressable>
                  <Pressable onPress={closeFilterModal} 
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [
                      styles.closeButton,
                      { opacity: pressed ? 0.5 : 1 }
                    ]}>
                    <ThemedText style={styles.buttonText}>Close</ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </Modal>

            <FlatList
              data={sortedTrees}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ThemedView style={styles.treeItem}>
                    <ThemedView>
                        <ThemedText style={styles.region}>{item.arrondissement}</ThemedText>
                        <ThemedText style={styles.treeSpecies}>{item.essence_fr}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.date}>{item.date_plantation}</ThemedText>
                </ThemedView>
              )}
            />
          </ThemedView>
        }
        headerImage={
          <Image source={require("@/assets/images/adaptive-icon.png")} style={styles.treeLogo} />
        }
      />
      {showBox && (
                <ThemedView style={styles.fixedBox}>
                    <ThemedText style={styles.overlayText}>Actions Possibles</ThemedText>
                    <ThemedView style={styles.buttonContainer}>
                        <Pressable style={({ pressed }) => [
                            styles.modifierButton,
                            {opacity: pressed ? 0.5 : 1},
                        ]}>
                            <ThemedText style={styles.modifierButtonText}>Modifier</ThemedText>
                        </Pressable>

                        <Pressable style={({ pressed }) => [
                            styles.modalButton,
                            {opacity: pressed ? 0.5 : 1},
                        ]}>
                            <ThemedText style={styles.modalButtonText}>Démarrer la validation</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>
            )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  treeLogo: { 
    height: 230, 
    width: 310, 
    bottom: 0, 
    left: 36, 
    position: "absolute" 
},
  searchBar: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f0f0f0", 
    borderRadius: 25, 
    padding: 15, 
    width: "100%", 
    alignSelf: "center", 
    marginVertical: 10 
},
  filterIcon: { 
    marginRight: 5 
},
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    paddingVertical: 0, 
    paddingHorizontal: 10 
},
  searchIcon: { 
    marginLeft: 5 
},
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    width: "100%",
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  applyButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#FF5722",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#9E9E9E",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  treeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  treeSpecies: {
    fontSize: 16,
    fontWeight: "bold",
  },
  region: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  fixedBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 10,
  },

  overlayText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -10,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    justifyContent: "center",
    letterSpacing: 1.5,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },

  modalButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  modifierButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  modifierButtonText: {
    color: "#388E3C",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
