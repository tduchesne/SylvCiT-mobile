import React, { useEffect, useState } from 'react';
import { TextInput, SafeAreaView, ScrollView, Button, StyleSheet, Alert, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ThemedText } from "@/components/ThemedText";

type ModifierArbreRouteParams = {
  ModifierArbre: {
    noEmp: string;
  };
};

export default function ModifierArbre() {
  const route = useRoute<RouteProp<ModifierArbreRouteParams, 'ModifierArbre'>>();
  const { noEmp } = route.params;

  const [empNo, setEmpNo] = useState('');
  const [adresse, setAdresse] = useState('');
  const [essenceLatin, setEssenceLatin] = useState('');
  const [essenceFr, setEssenceFr] = useState('');
  const [essenceAng, setEssenceAng] = useState('');
  const [dhp, setDhp] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [dateReleve, setDateReleve] = useState(new Date());
  const [datePlantation, setDatePlantation] = useState('');

  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetch(`${API_URL}/api/search_tree/${noEmp}`)
      .then((response) => response.json())
      .then((data) => {
        setEmpNo(data.no_emp);
        setAdresse(data.adresse);
        setEssenceLatin(data.essence_latin);
        setEssenceFr(data.essence_fr);
        setEssenceAng(data.essence_ang);
        setDhp(data.dhp);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setDateReleve(new Date(data.date_releve));
        setDatePlantation(data.date_plantation);
      })
      .catch((error) => Alert.alert('Erreur', "Impossible de récupérer les données de l'arbre"));
  }, [noEmp]);

  const modifierArbre = () => {
    fetch(`${API_URL}/api/modifier_arbre/${noEmp}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        no_emp: empNo,
        adresse,
        essence_latin: essenceLatin,
        essence_fr: essenceFr,
        essence_ang: essenceAng,
        dhp,
        latitude,
        longitude,
        date_releve: dateReleve,
        date_plantation: datePlantation,
      }),
    })
      .then((response) => response.json())
      .then((data) => Alert.alert('Succès', 'L\'arbre a été modifié avec succès'))
      .catch((error) => Alert.alert('Erreur', "Impossible de modifier les données de l'arbre"));
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <ThemedText>* Les champs en rouge sont obligatoires</ThemedText>
          <TextInput style={[styles.input, styles.champObligatoire]} value={empNo} editable={false} />
          <TextInput style={styles.input} value={adresse} onChangeText={setAdresse} placeholder="Adresse" />
          <TextInput style={styles.input} value={essenceLatin} onChangeText={setEssenceLatin} placeholder="Essence Latin" />
          <TextInput style={styles.input} value={essenceFr} onChangeText={setEssenceFr} placeholder="Essence Français" />
          <TextInput style={styles.input} value={essenceAng} onChangeText={setEssenceAng} placeholder="Essence Anglais" />
          <TextInput style={styles.input} value={dhp} onChangeText={setDhp} placeholder="DHP" keyboardType="numeric" />
          <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="Longitude" keyboardType="numeric" />
          <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="Latitude" keyboardType="numeric" />
        </View>
        <View style={styles.bouton}>
          <Button title="Modifier" onPress={modifierArbre} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  bouton: {
    padding: 10,
  },
  champObligatoire: {
    borderColor: 'red',
  },
});
