import { useState, useRef } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
//npx expo install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';
//npx expo install expo-image-picker
//import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Config from '../config';
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Location from 'expo-location';
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
//https://github.com/react-native-maps/react-native-maps
import MapView, { Region } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

export default function FormAjoutArbre() {


    const [empNo, setEmpNo] = useState('');
    const [adresse, setAdresse] = useState('');
    const [essenceLatin, setEssenceLatin] = useState('');
    const [essenceFr, setEssenceFr] = useState('');
    const [essenceAng, setEssenceAng] = useState('');
    const [dhp, setDhp] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [location, setLocation] = useState('');
    const [msgErreur, setMsgErreur] = useState('');
    const [dateReleve, setDateReleve] = useState(new Date())
    const [datePlantation, setDatePlantation] = useState('')
    const [modalDatePreleve, setModalDatePreleve] = useState(false)
    const [modalDatePlantation, setModalDatePlantation] = useState(false)
    const [indicateur, setIndicateur] = useState(false);
    const [invType, setInvType] = useState('');


    const colorScheme = useColorScheme();

    const sauvegarder = () => {

        if (!dateReleve || !longitude || !latitude || !invType) {
            Alert.alert("Merci de remplir tous les champs obligatoires");

        } else {
            setIndicateur(true)
            fetch(`${Config.API_URL}/api/add_tree`, {
                method: 'POST', headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "no_emp": empNo,
                    "inv_type": invType,
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
                .then((reponse) => validerReponse(reponse))
                .catch((response) => {
                    setIndicateur(false)
                    Alert.alert("Erreur lors du sauvegarde des données. Merci de réessayer")
                    remettreChamps;

                })


        }
    }


    const validerReponse = (response: Response) => {
        setIndicateur(false)
        if (response.status == 201) {
            Alert.alert("Informations sauvegardées")
            nettoyerChamps()
        }
        else {
            const description = response.json()
                .then(info => Alert.alert(info['description']))


        }


    }

    const trouverPosition = async (region: Region) => {
        setIndicateur(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setMsgErreur('Permission pour accéder à votre position refusée');
            return;
        }
        const location = await Location.reverseGeocodeAsync({
            latitude: region.latitude,
            longitude: region.longitude,
        });

        setAdresse(location[0].formattedAddress?.toString())
        /* setLatitude(location.coords.latitude.toString());
         setLongitude(location.coords.longitude.toString());*/


        setIndicateur(false);

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

    const choisirDateReleve = (event: any, dateReleveChoisie: any) => {
        setModalDatePreleve(false)
        setDateReleve(dateReleveChoisie)
    }

    const choisirDatePlantation = (event: any, dateRelevePlantation: any) => {
        setModalDatePlantation(false)
        setDatePlantation(formatDate(dateRelevePlantation))
    }


    return (
        <SafeAreaView >
            <ActivityIndicator size="large" color="#00ff00" animating={indicateur} style={[styles.indicateur]} />
            <ScrollView >
                <View>

                    <ThemedText>
                        * Les champs en rouge sont obligatoires</ThemedText>

                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEmpNo} value={empNo} placeholder="No emplacement" keyboardType="numeric" />
                    <Picker selectedValue={invType} onValueChange={(itemValue, itemIndex) => setInvType(itemValue)} style={[styles.input, styles.champObligatoire]}>
                        <Picker.Item label="Inv Type" value=" " />
                        <Picker.Item label="Type Rue" value="R" />
                        <Picker.Item label="Type Hors Rue" value="H" />
                    </Picker>
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setAdresse} value={adresse} placeholder="Adresse" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEssenceLatin} value={essenceLatin} placeholder="Essence_latin" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEssenceFr} value={essenceFr} placeholder="Essence_fr" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setEssenceAng} value={essenceAng} placeholder="Essence_ang" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setDhp} value={dhp} placeholder="DHP" keyboardType="numeric" />
                    <View style={styles.labelCal}><ThemedText style={styles.label} >Date relevé</ThemedText>
                        <Ionicons.Button backgroundColor={Colors[colorScheme ?? "light"].buttonBackground} name="calendar" onPress={() => setModalDatePreleve(true)} />
                        {modalDatePreleve && <DateTimePicker value={dateReleve} mode={"date"} onChange={choisirDateReleve}
                        />}
                    </View>
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }, styles.champObligatoire]}>{formatDate(dateReleve)}</TextInput>
                    <View style={styles.labelCal}><ThemedText style={styles.label} >Date de plantation</ThemedText>
                        <Ionicons.Button backgroundColor={Colors[colorScheme ?? "light"].buttonBackground} name="calendar" onPress={() => setModalDatePlantation(true)} />
                        {modalDatePlantation && <DateTimePicker value={new Date()} mode={"date"} onChange={choisirDatePlantation} />}
                    </View>
                    <TextInput editable={false} placeholder="Date de plantation" style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}>{datePlantation}</TextInput>
                    <View style={styles.container}>
                        <MapView style={styles.map} showsUserLocation={true} onRegionChangeComplete={(region) => { setLatitude(region.latitude.toString()), setLongitude(region.longitude.toString()), trouverPosition(region) }} />

                    </View>


                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }, styles.champObligatoire]} onChangeText={setLongitude} value={longitude} placeholder="Longitude" keyboardType="numeric" />
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }, , styles.champObligatoire]} onChangeText={setLatitude} value={latitude} placeholder="Latitude" keyboardType="numeric" />

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
    },

    indicateur: {
        alignSelf: "center",
        paddingVertical: 200,
        position: "absolute",
        zIndex: 10,

    },
    container: {

    },
    map: {
        height: 200,

    },

});


