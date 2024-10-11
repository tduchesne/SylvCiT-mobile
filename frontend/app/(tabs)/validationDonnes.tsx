import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import Screen from '@/components/Screen';

type TreeData = {
  id: number;
  name: string;
  family: string;
  genus: string;
  plantingDate: string;
  speciesEN: string;
  speciesFR: string;
  speciesLA: string;
  imageUrl: string;
};


const mockDatabase: TreeData[] = [
  {
    id: 1,
    name: 'Acer platanoides',
    family: 'Fabaceae',
    genus: 'Gymnocladus',
    plantingDate: '14/01/2016',
    speciesEN: 'Kentucky Coffee Tree',
    speciesFR: 'Chicot du Canada',
    speciesLA: 'Gymnocladus dioicus',
    imageUrl: 'https://arbresenligne.com/cdn/shop/files/SAULE-BRILLANT.jpg',
  },
  {
    id: 2,
    name: 'Pinus sylvestris',
    family: 'Pinaceae',
    genus: 'Pinus',
    plantingDate: '22/08/2010',
    speciesEN: 'Scots Pine',
    speciesFR: 'Pin sylvestre',
    speciesLA: 'Pinus sylvestris',
    imageUrl: 'https://example.com/scots-pine.jpg',
  },
];

export default function ValidationScreen() {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const colorScheme = useColorScheme(); 
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const fetchTreeData = () => {
      setTimeout(() => {
        const data = mockDatabase.find((tree) => tree.id === 1);
        setTreeData(data || null);
      }, 1000);
    };

    fetchTreeData();
  }, []);

  const handleValidate = () => {
    console.log('Arbre validé:', treeData?.name);
  };

  const handleSkip = () => {
    console.log('Arbre ignoré:', treeData?.name);
  };

  const handleModify = () => {
    console.log('Modifier l\'arbre:', treeData?.name);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Screen
        title={treeData ? treeData.name : 'Chargement...'}
        content={
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {treeData?.imageUrl ? (
              <Image
                source={{ uri: treeData.imageUrl }}
                style={styles.treeImage}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Image à venir...</Text>
              </View>
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>
                Famille: <Text style={styles.infoValue}>{treeData?.family}</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Genre: <Text style={styles.infoValue}>{treeData?.genus}</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Date de plantation: <Text style={styles.infoValue}>{treeData?.plantingDate}</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Espèce (EN): <Text style={styles.infoValue}>{treeData?.speciesEN}</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Espèce (FR): <Text style={styles.infoValue}>{treeData?.speciesFR}</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Espèce (LA): <Text style={styles.infoValue}>{treeData?.speciesLA}</Text>
              </Text>
            </View>
          </ScrollView>
        }
        headerImage={
          <Image
            source={require('@/assets/images/adaptive-icon.png')}
            style={styles.treeLogo}
          />
        }
      />
      
      <View style={[styles.fixedButtonContainer, { backgroundColor: isDarkMode ? '#232825' : '#fff' }]}>
        <TouchableOpacity
          style={[styles.modifyButton, { backgroundColor: isDarkMode ? '#8b0000' : '#c62828' }]}
          onPress={handleModify}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: isDarkMode ? '#ffd700' : '#fdd835' }]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Sauter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.validateButton, { backgroundColor: isDarkMode ? '#006400' : '#2e7d32' }]}
          onPress={handleValidate}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
    paddingHorizontal: 16,
  },
  treeImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
  },
  placeholder: {
    height: 200,
    width: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  infoContainer: {
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: 'green',
    fontSize: 14,
  },
  fixedButtonContainer: {
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  modifyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  validateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  treeLogo: {
    height: 230,
    width: 310,
    bottom: 0,
    left: 36,
    position: 'absolute',
  },
});
