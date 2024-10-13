import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, View, } from 'react-native';
//npm install react-native-date-picker
import DatePicker from 'react-native-date-picker'
//npx expo install expo-image-picker
//import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Config from '../config';
import { useColorScheme } from "@/hooks/useColorScheme";

import { Colors } from "@/constants/Colors";
//npm install @react-native-community/geolocation --savea
import Geolocation from '@react-native-community/geolocation';
import { ThemedText } from "@/components/ThemedText";

export default function FormAjoutArbre() {

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
    const [datePlantation, setDatePlantation] = useState('')
    const [modalDatePreleve, setModalDatePreleve] = useState(false)
    const [modalDatePlantation, setModalDatePlantation] = useState(false)

    const colorScheme = useColorScheme();

    const sauvegarder = () => {

        if (!dateReleve || !longitude || !latitude) {
            Alert.alert("Merci de remplir tous les champs obligatoires");

        } else {

            fetch(`${Config.API_URL}/api/add_tree`, {
                method: 'POST', headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "no_emp": empNo,
                    "adresse": adresse,
                    "essence_latin": essenceLatin,
                    "essence_fr": essenceFr,
                    "essence_ang": essenceAng,
                    "dhp": dhp,
                    "date_plantation": datePlantation,

                    "latitude": latitude,
                    "longitude": longitude,
                    "date_releve": formatDate(dateReleve)
                })
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .then(() => Alert.alert("Informations sauvegardées"))
                .then(nettoyerChamps)
                .catch(() => {
                    Alert.alert("Erreur lors du sauvegarde des données. Merci de réessayer")
                    remettreChamps;

                })


        }
    }

    const trouverPosition = () => {
        getLocation(setLatitude, setLongitude, setLocation, location)
    }

    const nettoyerChamps = () => {
        initialiserChamps(setEmpNo, setAdresse, setEssenceFr, setEssenceLatin, setEssenceAng, setDhp, setDateReleve, setDatePlantation, setLongitude, setLatitude)
    }

    const remettreChamps = () => {
        remplirChamps(setEmpNo, empNo, setAdresse, adresse, setEssenceFr, essenceFr, setEssenceLatin, essenceLatin, setEssenceAng, essenceLatin, setDhp, dhp, setDateReleve, dateReleve, setDatePlantation, datePlantation, setLongitude, longitude, setLatitude, latitude)
    }

    const annuler = () => {

        Alert.alert("Annuler", "Voulez-vous vraiment annuler l'opération ?", [{ text: "Oui", onPress: () => nettoyerChamps() }, { text: "Non" }])
    }

    return (
        <SafeAreaView >
            <ScrollView >
                <View>
                    <ThemedText>
                        * Les champs en rouge sont obligatoires</ThemedText>

                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEmpNo} value={empNo} placeholder="Numéro employé" keyboardType="numeric" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setAdresse} value={adresse} placeholder="Adresse" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEssenceLatin} value={essenceLatin} placeholder="Essence_latin" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEssenceFr} value={essenceFr} placeholder="Essence_fr" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEssenceAng} value={essenceAng} placeholder="Essence_ang" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setDhp} value={dhp} placeholder="DHP" keyboardType="numeric" />
                    <View style={styles.labelCal}><ThemedText style={styles.label} >Date relevé</ThemedText>
                        <Ionicons.Button backgroundColor={Colors[colorScheme ?? "light"].buttonBackground} name="calendar" onPress={() => setModalDatePreleve(true)} />
                        <DatePicker modal open={modalDatePreleve} date={dateReleve} onConfirm={(dateReleveChoisie) => {
                            setModalDatePreleve(false)
                            setDateReleve(dateReleveChoisie)
                        }}
                            onCancel={() => {
                                setModalDatePreleve(false)
                            }}
                        />
                    </View>
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }, styles.champObligatoire]}>{formatDate(dateReleve)}</TextInput>
                    <View style={styles.labelCal}><ThemedText style={styles.label} >Date de plantation</ThemedText>
                        <Ionicons.Button backgroundColor={Colors[colorScheme ?? "light"].buttonBackground} name="calendar" onPress={() => setModalDatePlantation(true)} />
                        <DatePicker modal open={modalDatePlantation} date={new Date()} onConfirm={(datePlantationChoisie) => {
                            setModalDatePlantation(false)
                            setDatePlantation(formatDate(datePlantationChoisie))

                        }}
                            onCancel={() => {
                                setModalDatePlantation(false)
                            }}
                        />
                    </View>
                    <TextInput editable={false} placeholder="Date de plantation" style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}>{datePlantation}</TextInput>
                    <View style={styles.labelCal}><ThemedText style={styles.label} >Trouvez ma position</ThemedText>

                        <View style={styles.boutonPosition}>
                            <Ionicons.Button name="earth" backgroundColor={Colors[colorScheme ?? "light"].buttonBackground} onPress={trouverPosition} />
                        </View>
                    </View>
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }, , styles.champObligatoire]} onChangeText={setLongitude} value={longitude.toString()} placeholder="Longitude" keyboardType="numeric" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }, , styles.champObligatoire]} onChangeText={setLatitude} value={latitude.toString()} placeholder="Latitude" keyboardType="numeric" />

                </View>
                <View style={[styles.bouton]}>
                    <Button title="Sauvegarder" color={Colors[colorScheme ?? "light"].buttonBackground} onPress={sauvegarder} />
                </View>
                <View style={styles.bouton}>
                    <Button title="Annuler" color={"grey"} onPress={annuler} />
                </View>
            </ScrollView>
        </SafeAreaView >


    );

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


function initialiserChamps(setEmpNo: any, setAdresse: any, setEssenceFr: any, setEssenceLatin: any, setEssenceAng: any, setDhp: any, setDateReleve: any, setDatePlantation: any, setLongitude: any, setLatitude: any) {

    setEmpNo('');
    setAdresse('');
    setEssenceFr('');
    setEssenceLatin('');
    setEssenceAng('');
    setDhp('');
    setDateReleve(new Date());
    setDatePlantation('');
    setLongitude('');
    setLatitude('');

}

function remplirChamps(setEmpNo: any, empNo: any, setAdresse: any, adresse: any, setEssenceFr: any, essenceFr: any, setEssenceLatin: any, essenceLatin: any, setEssenceAng: any, essenceAng: any, setDhp: any, dhp: any, setDateReleve: any, dateReleve: any, setDatePlantation: any, datePlantation: any, setLongitude: any, longitude: any, setLatitude: any, latitude: any) {

    setEmpNo(empNo);
    setAdresse(adresse);
    setEssenceFr(essenceFr);
    setEssenceLatin(essenceLatin);
    setEssenceAng(essenceAng);
    setDhp(dhp);
    setDateReleve(dateReleve);
    setDatePlantation(datePlantation);
    setLongitude(longitude);
    setLatitude(latitude);

}

/*
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
}*/

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

    champObligatoire: {
        borderColor: "red"
    },

    label: {

        paddingRight: 10,

    },

    labelCal: {
        flexDirection: "row",
        paddingBottom: 10,


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
        padding: 10

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


