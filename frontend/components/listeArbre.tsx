import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button } from 'react-native';
import Config from '../config';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from 'react-native-safe-area-context';



//////////////////////////////////
//Page seulement pour tester la fonctionalité ajout arbre. Pas pour la prod!!!!!!!
//////////////////////////////



interface Tree {
    no_emp: number;
    adresse: string;
    essence_latin: string;
    essence_fr: string;
    essence_ang: string;
    dhp: number;
    date_plantation: string;
    date_releve: string;
    latitude: number;
    longitude: number;
}

const TreeList = () => {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [loading, setLoading] = useState(true);

    const rafrai = () => {

        fetch(`${Config.API_URL}/api/trees`) // Replace with your actual API URL
            .then(response => response.json())
            .then((data: Tree[]) => setTrees(data));
    }



    const renderRow = ({ item }: { item: Tree }) => (

        <View style={styles.row}>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>No Emp</Text>
                <Text style={styles.cell}>{item.no_emp}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Adresse</Text>
                <Text style={styles.cell}>{item.adresse}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Essence Latin</Text>
                <Text style={styles.cell}>{item.essence_latin}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Essence FR</Text>
                <Text style={styles.cell}>{item.essence_fr}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Essence ANG</Text>
                <Text style={styles.cell}>{item.essence_ang}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>DHP</Text>
                <Text style={styles.cell}>{item.dhp}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Date Plantation</Text>
                <Text style={styles.cell}>{item.date_plantation}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Date Releve</Text>
                <Text style={styles.cell}>{item.date_releve}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Latitude</Text>
                <Text style={styles.cell}>{item.latitude}</Text>
            </View>
            <View style={styles.cellRow}>
                <Text style={styles.headerCell}>Longitude</Text>
                <Text style={styles.cell}>{item.longitude}</Text>
            </View>
        </View>

    );


    return (
        <SafeAreaView>

            <View style={styles.header}>
                <Text style={styles.headerText}>Liste des arbres</Text>
                <Text style={styles.headerText}>Nombre d'arbres : {trees.length}</Text>
            </View>

            <Button title="Refresh" onPress={rafrai} />


            <FlatList
                data={trees}
                renderItem={renderRow}
                keyExtractor={(item) => item.no_emp.toString()}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f8f8',
    },
    row: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    cellRow: {
        flexDirection: 'row',  // Align the header and value horizontally
        justifyContent: 'space-between',

    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        padding: 5,
    },
    cell: {
        flex: 1,
        padding: 5,
    },
    header: {
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
export default TreeList;
