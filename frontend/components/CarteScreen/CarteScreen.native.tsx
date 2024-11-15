import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, useColorScheme } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';
import Screen from "@/components/Screen";
import { Tree } from '../../app/(tabs)/liste_arbre';
import Config from '@/config';

export default function CarteScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [trees, setTrees] = useState<Tree[] | null>(null);

  const initialRegion: Region = {
    latitude: 45.5017,
    longitude: -73.5673,
    latitudeDelta: 0.0922 * 3,
    longitudeDelta: 0.0421 * 3,
  };

  useEffect(() => {
    if (trees == null) fetchAllTrees();
  }, []);

  const fetchAllTrees = async () => {
    console.log('fetch trees');
    try {
      const response = await fetch(`${Config.API_URL}/api/trees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Error: network response not ok");
        return;
      }

      const data = await response.json();
      setTrees(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des arbres :", error);
    }
  };

  const isValidCoordinate = (latitude: string, longitude: string) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    return !isNaN(lat) && !isNaN(lng);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Screen
        title="Carte"
        content={
          <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
            {trees != null && (
              <MapView
                style={styles.map}
                initialRegion={initialRegion}
                customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
              >
                {trees
                  .filter(tree => isValidCoordinate(tree.latitude, tree.longitude))
                  .map(tree => (
                    <Marker
                      key={tree.id_tree}
                      coordinate={{
                        latitude: parseFloat(tree.latitude),
                        longitude: parseFloat(tree.longitude),
                      }}
                      title={tree.essence_fr}
                      icon={
                        tree.id_tree % 3 === 0
                          ? require('@/assets/images/marqueurArbreMauve.png')
                          : require('@/assets/images/marqueurArbreVert.png')
                      }
                    >
                      <Callout tooltip>
                        <View style={styles.callout}>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Espèce (FR) :</Text>
                            <Text style={styles.calloutValue}>{tree.essence_fr}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Espèce (EN) :</Text>
                            <Text style={styles.calloutValue}>{tree.essence_ang}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Espèce (LA) :</Text>
                            <Text style={styles.calloutValue}>{tree.essence_latin}</Text>
                          </View>
                        </View>
                      </Callout>
                    </Marker>
                  ))}
              </MapView>
            )}
          </View>
        }
        headerImage={
          <Image
            source={require('@/assets/images/adaptive-icon.png')}
            style={styles.treeLogo}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').height - 20,
    borderRadius: 10,
  },
  treeLogo: {
    height: 230,
    width: 310,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -155 }, { translateY: -115 }],
  },
  callout: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    maxWidth: 200,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  calloutLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
    width: '50%',
  },
  calloutValue: {
    fontSize: 14,
    textAlign: 'right',
    width: '50%',
  },
});

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
];

const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#eaeaea' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
];
