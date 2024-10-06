import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';

export default function Ajouter_arbre() {

    const Form_ajout_arbre = () => {

        const [empNo, setEmpNo] = useState('');
        const [adresse, setAdresse] = useState('');
        const [essenceLatin, setEssenceLatin] = useState('');
        const [essenceFr, setEssenceFr] = useState('');
        const [essenceAng, setEssenceAng] = useState('');
        const [dhp, setDhp] = useState('');
        const [dateReleve, setDateReleve] = useState('');
        const [datePlantation, setDatePlantation] = useState('');
        const [localisation, setLocalisation] = useState('');
        const [longitude, setLongitude] = useState('');
        const [latitude, setLatitude] = useState('');
        const [location, setLocation] = useState(false);


        // function to check permissions and get Location
        const getLocation = () => {

            Geolocation.getCurrentPosition(
                position => {
                    console.log(position);
                    setLocation(true);

                },
                error => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                    setLocation(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );

            console.log(location);
        };

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
            <SafeAreaView >
                <ScrollView >
                    <View style={styles.form}>
                        <Text style={styles.titrePage}>Ajouter arbre</Text>
                        <TextInput onChangeText={setEmpNo} value={empNo} placeholder="Numéro d'employé" />
                        <TextInput onChangeText={setAdresse} value={adresse} placeholder="Adresse" />
                        <TextInput onChangeText={setEssenceLatin} value={essenceLatin} placeholder="Essence_latin" />
                        <TextInput onChangeText={setEssenceFr} value={essenceFr} placeholder="Essence_fr" />
                        <TextInput onChangeText={setEssenceAng} value={essenceAng} placeholder="Essence_ang" />
                        <TextInput onChangeText={setDhp} value={dhp} placeholder="DHP" keyboardType="numeric" />
                        <TextInput onChangeText={setDateReleve} value={dateReleve} placeholder="Date du Relevé" />
                        <TextInput onChangeText={setDatePlantation} value={datePlantation} placeholder="Date de Plantation" />
                        <TextInput onChangeText={setLocalisation} value={localisation} placeholder="Localisation" />
                        <View style={styles.boutonPosition}>
                            <Ionicons.Button name="earth" backgroundColor="green" size={32} onPress={getLocation} />
                        </View>
                        <TextInput onChangeText={setLongitude} value={longitude} placeholder="Longitude" keyboardType="numeric" />
                        <TextInput onChangeText={setLatitude} value={latitude} placeholder="Latitude" keyboardType="numeric" />
                        <ChargerPhoto />
                    </View>
                    <View style={styles.bouton}>
                        <Button title="Sauvegarder" color="green" onPress={sauvegarder} />
                    </View>
                    <View style={styles.bouton}>
                        <Button title="Annuler" color="grey" onPress={annuler} />
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
        <View style={styles.boutonPhoto}>
            <Button title="Charger photo de l'arbre" onPress={ChargerImage} color="lightgreen" />
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
        alignItems: "stretch",
        borderWidth: 5,
        borderColor: "green"


    },

    bouton: {
        padding: 10

    },

    titrePage: {
        fontSize: 30,
        textTransform: "uppercase",
        fontWeight: "900",
        color: "green",
        paddingBottom: 50,
        textAlign: "center"
    },
    boutonPhoto: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'


    },

    boutonPosition: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',

    },
    image: {
        width: 200,
        height: 200,
    }


});


