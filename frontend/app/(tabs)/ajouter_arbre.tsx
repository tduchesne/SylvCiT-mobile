import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
//npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Config from '../../config';
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";

//npm install @react-native-community/geolocation --save
import Geolocation from '@react-native-community/geolocation';
import { Navigator } from "expo-router";

export default function Ajouter_arbre() {

    const Form_ajout_arbre = () => {

        const [empNo, setEmpNo] = useState('');
        const [adresse, setAdresse] = useState('');
        const [essenceLatin, setEssenceLatin] = useState('');
        const [essenceFr, setEssenceFr] = useState('');
        const [essenceAng, setEssenceAng] = useState('');
        const [dhp, setDhp] = useState('');
        const [longitude, setLongitude] = useState('');
        const [latitude, setLatitude] = useState('');
        const [location, setLocation] = useState(false);
        const [dateReleve, setDateReleve] = useState(new Date())
        const [datePlantation, setDatePlantation] = useState("")
        const [modalDatePreleve, setModalDatePreleve] = useState(false)
        const [modalDatePlantation, setModalDatePlantation] = useState(false)

        const sauvegarder = () => {

            fetch(`${Config.API_URL}/api/add_tree`, {
                method: 'POST', headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "latitude": latitude,
                    "longitude": longitude,
                    "date_releve": formatDate(dateReleve)
                })
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(erreur => Alert.alert("Erreur survenue lors du sauvegarde des données"))


        }

        const trouverPosition = () => {
            getLocation(setLatitude, setLongitude, setLocation, location)
        }

        return (<Screen
            title="Ajouter Arbre"
            content={

                <SafeAreaView >
                    <ScrollView >
                        <View>
                            <TextInput onChangeText={setEmpNo} value={empNo} placeholder="Numéro employé" />
                            <TextInput onChangeText={setAdresse} value={adresse} placeholder="Adresse" />
                            <TextInput onChangeText={setEssenceLatin} value={essenceLatin} placeholder="Essence_latin" />
                            <TextInput onChangeText={setEssenceFr} value={essenceFr} placeholder="Essence_fr" />
                            <TextInput onChangeText={setEssenceAng} value={essenceAng} placeholder="Essence_ang" />
                            <TextInput onChangeText={setDhp} value={dhp} placeholder="DHP" keyboardType="numeric" />
                            <Text>Date relevé
                                <Ionicons.Button backgroundColor="green" name="calendar" onPress={() => setModalDatePreleve(true)} />
                                <DatePicker modal open={modalDatePreleve} date={dateReleve} onConfirm={(dateReleveChoisie) => {
                                    setModalDatePreleve(false)
                                    setDateReleve(dateReleveChoisie)
                                }}
                                    onCancel={() => {
                                        setModalDatePreleve(false)
                                    }}
                                /></Text>
                            <TextInput >{formatDate(dateReleve)}</TextInput>
                            <Text>Date de Plantation
                                <Ionicons.Button backgroundColor="green" name="calendar" onPress={() => setModalDatePlantation(true)} />
                                <DatePicker modal open={modalDatePlantation} date={new Date()} onConfirm={(datePlantationChoisie) => {
                                    setModalDatePlantation(false)
                                    setDatePlantation(formatDate(datePlantationChoisie))

                                }}
                                    onCancel={() => {
                                        setModalDatePlantation(false)
                                    }}
                                />
                            </Text>
                            <TextInput editable={false} placeholder="Date de plantation">{datePlantation}</TextInput>
                            <Text>Trouvez ma position
                                <View style={styles.boutonPosition}>
                                    <Ionicons.Button name="earth" backgroundColor="green" size={32} onPress={trouverPosition} />
                                </View></Text>
                            <TextInput onChangeText={setLongitude.toString} value={longitude.toString()} placeholder="Longitude" keyboardType="numeric" />
                            <TextInput onChangeText={setLatitude.toString} value={latitude.toString()} placeholder="Latitude" keyboardType="numeric" />

                        </View>
                        <View style={styles.bouton}>
                            <Button title="Sauvegarder" color="green" onPress={sauvegarder} />
                        </View>
                        <View style={styles.bouton}>
                            <Button title="Annuler" color="grey" onPress={annuler} />
                        </View>
                    </ScrollView>
                </SafeAreaView>

            } headerImage={
                <Image
                    source={require("@/assets/images/adaptive-icon.png")}
                    style={styles.treeLogo}
                />
            } />
        );
    }

    return (<Form_ajout_arbre />);


}


function annuler() {
    const navigation = useNavigation();
    Alert.alert("Annuler", "Voulez-vous vraiment annuler l'opération ?", [{ text: "Oui" }, { text: "Non" }])
}


// Fonction pour la localisation
function getLocation(setLatitude: any, setLongitude: any, setLocation: any, location: any) {

    Geolocation.getCurrentPosition(
        position => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLocation(true);

        },
        error => {
            console.log(error.code, error.message);
            setLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );

    console.log(location);
};





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

function formatDate(date: Date) {
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const styles = StyleSheet.create({
    treeLogo: {
        height: 230,
        width: 310,
        bottom: 0,
        left: 36,
        position: "absolute",
    },

    form: {

        alignItems: "stretch",

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


