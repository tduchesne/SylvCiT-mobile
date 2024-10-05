import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, Text, View } from 'react-native';
import Screen from "@/components/Screen";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';


export default function Ajouter_arbre() {

    const Form_ajout_arbre = () => {

        const [empNo, setEmpNo] = useState('');
        const [rue, setRue] = useState('');
        const [essenceLatin, setEssenceLatin] = useState('');
        const [essenceFr, setEssenceFr] = useState('');
        const [essenceAng, setEssenceAng] = useState('');
        const [dhp, setDhp] = useState('');
        const [dateReleve, setDateReleve] = useState('');
        const [datePlantation, setDatePlantation] = useState('');
        const [localisation, setLocalisation] = useState('');
        const [longitude, setLongitude] = useState('');
        const [latitude, setLatitude] = useState('');


        const sauvegarder = () => {

            fetch('/api/add_tree', {
                method: 'POST', headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "latitude": latitude,
                    "longitude": longitude,
                    "date_releve": dateReleve
                })
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(erreur => Alert.alert("Erreur survenue lors du sauvegarde des données"))


        }


        return (
            <SafeAreaView style={styles.form}>
                <ScrollView >
                    <Text style={styles.titrePage}>Ajouter arbre</Text>
                    <TextInput onChangeText={setEmpNo} value={empNo} placeholder="EMP_NO" />
                    <TextInput onChangeText={setRue} value={rue} placeholder="Rue" />
                    <TextInput onChangeText={setEssenceLatin} value={essenceLatin} placeholder="Essence_latin" />
                    <TextInput onChangeText={setEssenceFr} value={essenceFr} placeholder="Essence_fr" />
                    <TextInput onChangeText={setEssenceAng} value={essenceAng} placeholder="Essence_ang" />
                    <TextInput onChangeText={setDhp} value={dhp} placeholder="DHP" keyboardType="numeric" />
                    <TextInput onChangeText={setDateReleve} value={dateReleve} placeholder="Date_Releve" />
                    <TextInput onChangeText={setDatePlantation} value={datePlantation} placeholder="Date_Plantation" />
                    <TextInput onChangeText={setLocalisation} value={localisation} placeholder="LOCALISATION" />
                    <TextInput onChangeText={setLongitude} value={longitude} placeholder="Longitude" keyboardType="numeric" />
                    <TextInput onChangeText={setLatitude} value={latitude} placeholder="Latitude" keyboardType="numeric" />
                    <ChargerPhoto />
                    <View style={styles.bouton}>
                        <Button title="Sauvegarder" color="green" onPress={sauvegarder} />
                    </View>
                    <View style={styles.bouton}>
                        <Button title="Annuler" color="lightgrey" onPress={annuler} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (<Form_ajout_arbre />);


}


function annuler() {

    Alert.alert("Annuler", "Voulez-vous vraiment annuler l'opération ?", [{ text: "Oui" }, { text: "Non" }])
}




const ChargerPhoto = () => {
    const [image, setImage] = useState<string | null>(null);

    const ChargerImage = async () => {
        // Ajout de permission dans le sprint 2
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Charger photo de l'arbre" onPress={ChargerImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
}


const styles = StyleSheet.create({
    treeLogo: {
        height: 230,
        width: 310,
        bottom: 0,
        left: 36,
        position: "absolute",
    },

    form: {
        padding: 30,
        paddingTop: 200,
        alignItems: "stretch"

    },

    bouton: {
        padding: 10
    },

    titrePage: {
        fontSize: 30,
        textTransform: "uppercase",
        color: "green",
        paddingBottom: 50,
        textAlign: "center"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    }


});


