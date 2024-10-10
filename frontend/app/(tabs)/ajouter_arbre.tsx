import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert, Text, View } from 'react-native';

import DatePicker from 'react-native-date-picker'
//npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Config from '../../config';

//npm install @react-native-community/geolocation --save
import Geolocation from '@react-native-community/geolocation';

export default function Ajouter_arbre() {

    const Form_ajout_arbre = () => {

        const [empNo, setEmpNo] = useState('');
        const [adresse, setAdresse] = useState('');
        const [essenceLatin, setEssenceLatin] = useState('');
        const [essenceFr, setEssenceFr] = useState('');
        const [essenceAng, setEssenceAng] = useState('');
        const [dhp, setDhp] = useState('');
        const [localisation, setLocalisation] = useState('');
        const [longitude, setLongitude] = useState(Number);
        const [latitude, setLatitude] = useState(Number);
        const [location, setLocation] = useState(false);
        const [dateReleve, setDateReleve] = useState(new Date())
        const [datePlantation, setDatePlantation] = useState(new Date())
        const [modalDatePreleve, setModalDatePreleve] = useState(false)
        const [modalDatePlantation, setModalDatePlantation] = useState(false)


        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };




        // function to check permissions and get Location
        const getLocation = () => {

            Geolocation.getCurrentPosition(
                position => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
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

            fetch('${Config.API_URL}/api/add_tree', {
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
                        <Text>Numéro employé</Text>
                        <TextInput onChangeText={setEmpNo} value={empNo} />
                        <Text>Adresse</Text>
                        <TextInput onChangeText={setAdresse} value={adresse} placeholder="Adresse" />
                        <Text>Nom latin</Text>
                        <TextInput onChangeText={setEssenceLatin} value={essenceLatin} placeholder="Essence_latin" />
                        <Text>Nom FR</Text>
                        <TextInput onChangeText={setEssenceFr} value={essenceFr} placeholder="Essence_fr" />
                        <Text>Nom EN</Text>
                        <TextInput onChangeText={setEssenceAng} value={essenceAng} placeholder="Essence_ang" />
                        <Text>Dimension</Text>
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
                        <TextInput editable={false}>{formatDate(dateReleve)}</TextInput>
                        <Text>Date de Plantation
                            <Ionicons.Button backgroundColor="green" name="calendar" onPress={() => setModalDatePlantation(true)} />
                            <DatePicker modal open={modalDatePlantation} date={datePlantation} onConfirm={(datePlantationChoisie) => {
                                setModalDatePlantation(false)
                                setDatePlantation(datePlantationChoisie)
                            }}
                                onCancel={() => {
                                    setModalDatePlantation(false)
                                }}
                            />
                        </Text>
                        <TextInput editable={false}></TextInput>
                        <Text>Trouvez ma position
                            <View style={styles.boutonPosition}>
                                <Ionicons.Button name="earth" backgroundColor="green" size={32} onPress={getLocation} />
                            </View></Text>
                        <TextInput onChangeText={setLongitude.toString} value={longitude.toString()} placeholder="Longitude" keyboardType="numeric" />
                        <TextInput onChangeText={setLatitude.toString} value={latitude.toString()} placeholder="Latitude" keyboardType="numeric" />
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


