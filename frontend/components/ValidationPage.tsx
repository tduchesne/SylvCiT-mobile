import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import Screen from '@/components/Screen';
import Config from "@/config";
import { Tree } from '@/app/(tabs)/liste_arbre';
import Icon from '@expo/vector-icons/Ionicons';

export default function ValidationScreen({ propsTreeList, startIdx, handleEndValidation }: { propsTreeList: Tree[], startIdx: number, handleEndValidation: () => void }) {
  const [treeData, setTreeData] = useState<Tree | null>(propsTreeList[startIdx]);
  const [treeList, setTreeList] = useState<Tree[]>(propsTreeList);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const modifyTreeStatus = async (id: number, status: string) => {
    try {
      const requestBody = {
        approbation_status: status,
      };
      const response = await fetch(`${Config.API_URL}/api/tree/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const exitToMenu = () => {
    handleEndValidation();
  }

  // Open next tree in tree list. If 'removeFromList', remove tree from list and exit if list.length == 0.
  // Otherwise, exit if list.length == 1.
  const seekNextTree = (removeFromList: boolean): boolean => {
    let index = treeData ? treeList.indexOf(treeData) : -1;

    if (index != -1) {
      if (removeFromList) {
        if (treeList.length > 1) {
          setTreeData(treeList[(index + 1) % treeList.length]);

          const updatedList = [...treeList];
          updatedList.splice(index, 1);
          setTreeList(updatedList);

          return true;
        } else {
          setTreeList([]);
          setTreeData(null);
        }
      }
      else {
        if (treeList.length > 1) {
          setTreeData(treeList[(index + 1) % treeList.length]);
          return true;
        }
      }
    }
    exitToMenu();
    return false;
  }

  const handleValidate = async () => {
    console.log('Arbre validé:', treeData?.essence_fr);
    if (treeData) {

      modifyTreeStatus(treeData.id_tree, 'approved');
      seekNextTree(true);
    }
  };

  const handleSkip = () => {
    console.log('Arbre ignoré:', treeData?.essence_fr);
    seekNextTree(false);
  };

  const handleModify = () => {
    console.log('Modifier l\'arbre:', treeData?.essence_fr);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <TouchableOpacity onPress={exitToMenu} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>
      <Screen
        title={treeData ? treeData.essence_fr : 'Chargement...'}
        content={
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {treeData?.image_url ? (
              <Image
                source={{ uri: treeData.image_url }}
                style={styles.treeImage}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Image à venir...</Text>
              </View>
            )}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Famille:</Text>
                <Text style={styles.infoValue}>{treeData?.family_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Genre:</Text>
                <Text style={styles.infoValue}>{treeData?.genre_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Date de plantation:</Text>
                <Text style={styles.infoValue}>{formatDate(treeData?.date_plantation)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Date de mesure:</Text>
                <Text style={styles.infoValue}>{formatDate(treeData?.date_releve)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Espèce (EN):</Text>
                <Text style={styles.infoValue}>{treeData?.essence_ang}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Espèce (FR):</Text>
                <Text style={styles.infoValue}>{treeData?.essence_fr}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Espèce (LA):</Text>
                <Text style={styles.infoValue}>{treeData?.essence_latin}</Text>
              </View>
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
          style={[styles.modifyButton, styles.buttonOutline, { borderColor: isDarkMode ? '#8b0000' : '#c62828' }]}
          onPress={handleModify}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: isDarkMode ? '#8b0000' : '#c62828' }]}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.skipButton, styles.buttonOutline, { borderColor: isDarkMode ? '#ffd700' : '#fdd835' }]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: isDarkMode ? '#ffd700' : '#fdd835' }]}>Sauter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.validateButton, styles.buttonOutline, { borderColor: isDarkMode ? '#006400' : '#2e7d32' }]}
          onPress={handleValidate}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: isDarkMode ? '#006400' : '#2e7d32' }]}>Valider</Text>
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
    resizeMode: 'contain',
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
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignSelf: 'stretch',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
  },
  infoValue: {
    fontSize: 14,
    color: 'green',
    flex: 1,
    textAlign: 'right',
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
  buttonOutline: {
    borderWidth: 2,
    backgroundColor: 'transparent',
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});
