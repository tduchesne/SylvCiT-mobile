import { useState } from "react";
import { TextInput, SafeAreaView, ScrollView, Button, Image, StyleSheet, Alert } from 'react-native';
import Screen from "@/components/Screen";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { Colors } from "@/constants/Colors";

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



        return (
            <SafeAreaView>
                <ScrollView>
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

                    <Button title="Sauvegarder" color="green" onPress={sauvegarder} />
                    <Button title="Annuler" color="lightgrey" onPress={annuler} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (<Form_ajout_arbre />);


}

function sauvegarder() {

    Alert.alert("Sauvegarder")
}

function annuler() {

    Alert.alert("Annuler?")
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
        alignContent: "space-between"
    }


});


