import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Alert, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Analyse_arbre() {

    const Form_analyse_arbre = () => {

        const [adresse, setAdresse] = useState<string>('');
        const [especeLat, setEspeceLat] = useState<string>('');
        const [especeFr, setEspeceFr] = useState<string>('');
        const [especeAng, setEspeceAng] = useState<string>(''); 

        const [dhp, setDhp] = useState<string>('');  // Format: numeric/numeric

        const [famille, setFamille] = useState<string>('');
        const [genre, setGenre] = useState<string>('');
        const [datePlantation, setDatePlantation] = useState<string>('');
        const [dateMesure, setDateMesure] = useState<string>('');

        return (
            <SafeAreaView style={styles.form}>
                <ScrollView>
                    <Text style={styles.titrePage}>Votre arbre</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Adresse</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setAdresse} 
                            value={adresse} 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Essence (Latin)</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setEspeceLat} 
                            value={especeLat} 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Essence (Français)</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setEspeceFr} 
                            value={especeFr} 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Essence (Anglais)</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setEspeceAng} 
                            value={especeAng} 
                        />
                    </View>

                    <View style={styles.inputContainer}>  
                        <View style={styles.dhpContainer}>
                            <Text style={styles.label}>DHP</Text>
                            <Text style={styles.label}>DHP max</Text>
                        </View>
                        <TextInput 
                            style={[styles.input, styles.dhpInput]} 
                            onChangeText={setDhp} 
                            value={dhp} 
                            placeholder="DHP (numeric/numeric)" 
                            keyboardType="default"  // dhp/dhp max
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Famille</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setFamille} 
                            value={famille} 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Genre</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setGenre} 
                            value={genre} 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date de Plantation</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setDatePlantation} 
                            value={datePlantation} 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date de Mesure</Text>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={setDateMesure} 
                            value={dateMesure} 
                        />
                    </View>

                    <View style={styles.boutonContainer}>
                        <TouchableOpacity style={styles.boutonFilled} onPress={confirmer}>
                            <Text style={styles.boutonText}>Confirmer</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.boutonContainer}>
                        <TouchableOpacity style={styles.boutonFilledRed} onPress={annuler}>
                            <Text style={styles.boutonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (<Form_analyse_arbre />);
}

function confirmer() {
    Alert.alert("Arbre ajouté");
}

function annuler() {
    Alert.alert("Annuler", "Voulez-vous vraiment annuler l'opération ?", [{ text: "Oui" }, { text: "Non" }]);
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        paddingHorizontal: 20, 
        paddingVertical: 30,  
        backgroundColor: '#F0F4F8',  
    },
    inputContainer: {
        marginBottom: 20, 
        marginHorizontal: 20, 
    },
    boutonContainer: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    boutonFilled: {
        backgroundColor: '#4CAF50',  
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    boutonFilledRed: {
        backgroundColor: '#f44336', 
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    boutonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    titrePage: {
        fontSize: 30,
        textTransform: "uppercase",
        color: "#2E7D32", 
        paddingBottom: 50,
        textAlign: "center",
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 2,
        borderColor: '#80CBC4', 
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff', 
    },
    dhpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dhpInput: {
        textAlign: 'center', 
    },
});
