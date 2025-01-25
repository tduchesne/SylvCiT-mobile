
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CarteScreen from '../../components/CarteScreen/CarteScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <CarteScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



