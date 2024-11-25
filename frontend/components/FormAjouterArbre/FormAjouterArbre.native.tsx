import { useState, useEffect } from "react";
import React from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
//npx expo install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';
//npx expo install expo-image-picker
//import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Config from '../../config';
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Location from 'expo-location';
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
//https://github.com/react-native-maps/react-native-maps
import MapView, { Region } from 'react-native-maps';
//npx expo install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';


export default function FormAjoutArbre() {


    const [empNo, setEmpNo] = useState('');
    const [adresse, setAdresse] = useState('');
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
    const colorScheme = useColorScheme();
    const [genres, setGenres] = useState([]);
    const [types, setTypes] = useState([]);
    const [functionalGroup, setFunctionalGroup] = useState([]);
    const [family, setFamily] = useState([]);
    const [genreChoisi, setGenreChoisi] = useState('');
    const [typeChoisiFR, setTypeChoisiFR] = useState('');
    const [typeChoisiLA, setTypeChoisiLA] = useState('');
    const [typeChoisiEN, setTypeChoisiEN] = useState('');
    const [functionalGroupChoisi, setFunctionalGroupChoisi] = useState('');
    const [familyChoisi, setFamilyChoisi] = useState('');

    useEffect(() => {
        fetchGenres();
        fetchFamily();
        fetchFunctionalGroup();
        fetchTypes();
    }, []);


    //Fonction pour importer les genres de la table genre
    const fetchGenres = async () => {
        try {
            const response = await fetch(`${Config.API_URL}/api/genre`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Impossible d'importer les genres");
            }
            const data = await response.json();
            setGenres(data);
        } catch (error) {
            Alert.alert("Error", "Impossible d'importer les genres.");
        }
    };


    //Fonction pour importer les types de la table type
    const fetchTypes = async () => {
        try {
            const response = await fetch(`${Config.API_URL}/api/type`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Impossible d'importer les types");
            }
            const data = await response.json();
            setTypes(data);
        } catch (error) {
            Alert.alert("Error", "Impossible d'importer les types.");
        }
    };

    //Fonction pour importer les functional group de la table functional group
    const fetchFunctionalGroup = async () => {
        try {
            const response = await fetch(`${Config.API_URL}/api/functional_group`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Impossible d'importer les functional group");
            }
            const data = await response.json();
            setFunctionalGroup(data);
        } catch (error) {
            Alert.alert("Error", "Impossible d'importer les function group.");
        }
    };

    //Fonction pour importer les types de la table type
    const fetchFamily = async () => {
        try {
            const response = await fetch(`${Config.API_URL}/api/family`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Impossible d'importer les familles");
            }
            const data = await response.json();
            setFamily(data);
        } catch (error) {
            Alert.alert("Error", "Impossible d'importer les familles.");
        }
    };


    //Fonction pour envoyer les données au backend
    const sauvegarder = () => {

        if (!dateReleve || !longitude || !latitude) {
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
                    "adresse": adresse,
                    "type": typeChoisiFR,
                    "dhp": dhp,
                    "date_plantation": datePlantation,
                    "latitude": latitude,
                    "longitude": longitude,
                    "date_releve": formatDate(dateReleve),
                    "genre": genreChoisi,
                    "family": familyChoisi,
                    "functional_group": functionalGroupChoisi
                })
            })
                .then((reponse) => validerReponse(reponse))
                .catch(() => {
                    setIndicateur(false)
                    Alert.alert("Erreur lors du sauvegarde des données. Merci de réessayer")
                    remettreChamps;

                })


        }
    }

    //Fonction pour vérifier la réponse du serveur
    const validerReponse = async (response: Response) => {

        setIndicateur(false)


        if (response.ok) {
            Alert.alert("Informations sauvegardées")
            nettoyerChamps()
        } else {
            const description = await response.json()
            Alert.alert(description['description'])
        }


    }

    // Fonction qui trouve l'adresse à partir des coordonnées GPS
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

        setAdresse(location[0].formattedAddress?.toString() ?? '')
        setIndicateur(false);

    }

    //Fonction pour réinitialiser les champs du formulaire
    const nettoyerChamps = () => {
        initialiserChamps(setEmpNo, setAdresse, setTypeChoisiFR, setTypeChoisiLA, setTypeChoisiEN, setDhp, setDateReleve, setDatePlantation, setLongitude, setLatitude, setFamilyChoisi, setFunctionalGroupChoisi, setGenreChoisi)
    }

    //Fonction qui remet les derniers valeurs entrées par l'utilisateur dans les champs
    const remettreChamps = () => {
        remplirChamps(setEmpNo, empNo, setAdresse, adresse, setTypeChoisiFR, typeChoisiFR, setTypeChoisiLA, typeChoisiLA, setTypeChoisiEN, typeChoisiEN, setDhp, dhp, setDateReleve, dateReleve, setDatePlantation, datePlantation, setLongitude, longitude, setLatitude, latitude, setFamilyChoisi, familyChoisi, setFunctionalGroupChoisi, functionalGroupChoisi, setGenreChoisi, genreChoisi)
    }


    const annuler = () => {

        Alert.alert("Annuler", "Voulez-vous vraiment annuler l'opération ?", [{ text: "Oui", onPress: () => nettoyerChamps() }, { text: "Non" }])
    }

    //Fonction qui assigne la date choisie dans le calendrier
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

                    <View style={[styles.input]}>
                        <Picker
                            selectedValue={genreChoisi}
                            onValueChange={(itemValue) => setGenreChoisi(itemValue)}>
                            <Picker.Item label="Choisir un genre" value="" />
                            {genres.map((genre) => (
                                <Picker.Item key={genre["id_genre"]} label={genre["name"]} value={genre["name"]} />
                            ))}
                        </Picker>
                    </View>
                    <View style={[styles.input]}>
                        <Picker
                            selectedValue={typeChoisiFR}
                            onValueChange={(itemValue) => setTypeChoisiFR(itemValue)}>
                            <Picker.Item label="Choisir un type FR" value="" />
                            {types.map((type) => (
                                <Picker.Item key={type["id_type"]} label={type["name_fr"]} value={type["name_fr"]} />
                            ))}
                        </Picker>
                    </View>
                    <View style={[styles.input]}>
                        <Picker
                            selectedValue={functionalGroupChoisi}
                            onValueChange={(itemValue) => setFunctionalGroupChoisi(itemValue)}>
                            <Picker.Item label="Choisir un functional group" value="" />
                            {functionalGroup.map((functionalGroup) => (
                                <Picker.Item key={functionalGroup["id_functional_group"]} label={functionalGroup["group"]} value={functionalGroup["group"]} />
                            ))}
                        </Picker>
                    </View>
                    <View style={[styles.input]}>
                        <Picker
                            selectedValue={familyChoisi}
                            onValueChange={(itemValue) => setFamilyChoisi(itemValue)}>
                            <Picker.Item label="Choisir une famille" value="" />
                            {family.map((famille) => (
                                <Picker.Item key={famille["id_family"]} label={famille["name"]} value={famille["name"]} />
                            ))}
                        </Picker>
                    </View>

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
                    <TextInput style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]} onChangeText={setAdresse} value={adresse} placeholder="Adresse" />

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


function initialiserChamps(setEmpNo: any, setAdresse: any, setTypeChoisFr: any, setTypeChoisiLa: any, setTypeChoisiEN: any, setDhp: any, setDateReleve: any, setDatePlantation: any, setLongitude: any, setLatitude: any, setFamilyChoisi: any, setFunctionalGroupChoisi: any, setGenreChoisi: any) {

    setEmpNo('');
    setAdresse('');
    setTypeChoisFr('');
    setTypeChoisiLa('');
    setTypeChoisiEN('');
    setDhp('');
    setDateReleve(new Date());
    setDatePlantation('');
    setLongitude('');
    setLatitude('');
    setFamilyChoisi('');
    setFunctionalGroupChoisi('');
    setGenreChoisi('');

}

function remplirChamps(setEmpNo: any, empNo: any, setAdresse: any, adresse: any, setTypeChoisiFr: any, typeChoisiFR: any, setTypeChoisiLA: any, typeChoisiLA: any, setTypeChoisiEN: any, typeChoisiEN: any, setDhp: any, dhp: any, setDateReleve: any, dateReleve: any, setDatePlantation: any, datePlantation: any, setLongitude: any, longitude: any, setLatitude: any, latitude: any, setFamilyChoisi: any, familyChoisi: any, setFunctionalGroupChoisi: any, functionalGroupChoisi: any, setGenreChoisi: any, genreChoisi: any) {

    setEmpNo(empNo);
    setAdresse(adresse);
    setTypeChoisiFr(typeChoisiFR);
    setTypeChoisiLA(typeChoisiLA);
    setTypeChoisiEN(typeChoisiEN);
    setDhp(dhp);
    setDateReleve(dateReleve);
    setDatePlantation(datePlantation);
    setLongitude(longitude);
    setLatitude(latitude);
    setFamilyChoisi(familyChoisi);
    setGenreChoisi(genreChoisi);
    setFunctionalGroupChoisi(functionalGroupChoisi)

}


//Fonction qui retourne la date dans le format YYYY-MM-DD
function formatDate(date: Date) {
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
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


