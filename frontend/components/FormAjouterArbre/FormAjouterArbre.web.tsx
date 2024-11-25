import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WebPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});
