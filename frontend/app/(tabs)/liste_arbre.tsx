import React, { useState } from "react";
import Screen from "@/components/Screen";
import { StyleSheet, TextInput, FlatList, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

{
    /* Tree list example, remove this when pulling backend data into treeDetails
       NOT SURE ABOUT ALL DATA    
    */
}
const treeList = [
    {
        id: "1",
        region: "Montréal - Anjou",
        species: "Oak",
        datePlanted: "2020-03-12",
        city: "Montréal",
        age: 10,
        height: "5m",
    },
    {
        id: "2",
        region: "Laval - Centre",
        species: "Pine",
        datePlanted: "2019-06-21",
        city: "Laval",
        age: 8,
        height: "6m",
    },
    {
        id: "3",
        region: "Québec City - Beauport",
        species: "Maple",
        datePlanted: "2018-05-10",
        city: "Québec",
        age: 15,
        height: "7m",
    },
    {
        id: "5",
        region: "Gatineau - Hull",
        species: "Cedar",
        datePlanted: "2021-07-14",
        city: "Gatineau",
        age: 7,
        height: "4m",
    },
];

export default function TabTwoScreen() {
    
    const [searchText, setSearchText] = useState("");
    const [showBox] = useState(true);

    const filteredTrees = treeList.filter((tree) => {
        {
            /* Not sure about all data that goes into a tree object, please change if necessary */
        }
        const treeDetails =
            `${tree.region} ${tree.species} ${tree.city} ${tree.datePlanted} ${tree.age} ${tree.height}`.toLowerCase();
        return treeDetails.includes(searchText.toLowerCase());
    });

    return (
        <ThemedView style={{ flex: 1 }}>
            <Screen
                title="Données à valider"
                content={
                    <ThemedView style={styles.container}>
                        <ThemedView style={styles.searchBar}>
                            <Ionicons
                                name="filter-outline"
                                size={24}
                                color="gray"
                                style={styles.filterIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Entrer un filtre"
                                placeholderTextColor="gray"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            <Ionicons
                                name="search-outline"
                                size={24}
                                color="gray"
                                style={styles.searchIcon}
                            />
                        </ThemedView>

                        <ThemedView style={styles.listAndBoxContainer}>
                            <FlatList
                                data={filteredTrees}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <ThemedView style={styles.treeItem}>
                                        <ThemedView style={{ flex: 1 }}>
                                            <ThemedText style={styles.region}>
                                                {item.region}
                                            </ThemedText>
                                            <ThemedText style={styles.treeSpecies}>
                                                {item.species}
                                            </ThemedText>
                                        </ThemedView>
                                        <ThemedText style={styles.date}>
                                            {item.datePlanted}
                                        </ThemedText>
                                    </ThemedView>
                                )}
                                contentContainerStyle={{ paddingBottom: 150 }}
                            />
                        </ThemedView>
                    </ThemedView>
                }
                headerImage={
                    <Image
                        source={require("@/assets/images/adaptive-icon.png")}
                        style={styles.treeLogo}
                    />
                }
            />

            {showBox && (
                <ThemedView style={styles.fixedBox}>
                    <ThemedText style={styles.overlayText}>Actions Possibles</ThemedText>
                    <ThemedView style={styles.buttonContainer}>
                        <Pressable style={styles.modifierButton}>
                            <ThemedText style={styles.modifierButtonText}>Modifier</ThemedText>
                        </Pressable>
                        <Pressable style={styles.modalButton}>
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
        flex: 1,
    },

    treeLogo: {
        height: 230,
        width: 310,
        bottom: 0,
        left: 36,
        position: "absolute",
    },

    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        width: "100%",
        alignSelf: "center",
    },

    filterIcon: {
        marginRight: 5,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        paddingHorizontal: 10,
    },

    searchIcon: {
        marginLeft: 5,
    },

    listAndBoxContainer: {
        flex: 1,
        position: "relative",
    },

    treeItem: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ddd",
    },

    region: {
        fontSize: 14,
        color: "#888",
    },

    treeSpecies: {
        fontSize: 18,
        fontWeight: "bold",
    },

    date: {
        fontSize: 14,
        color: "#666",
    },

    fixedBox: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#b2e3b5",
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        elevation: 5,
        zIndex: 10,
    },

    overlayText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 1.2,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },

    modalButton: {
        backgroundColor: "#388E3C",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },

    modalButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },

    modifierButton: {
        backgroundColor: "white",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },

    modifierButtonText: {
        color: "#4CAF50",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },


});
