import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, useColorScheme, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';
import Screen from "@/components/Screen";
import Config from '@/config';

interface Tree {
  id_tree: number;
  latitude: string;
  longitude: string;
  name_fr: string;
  name_en: string;
  name_la: string;
  genre: string;
  family_name: string;
  date_measure: string;
  date_plantation: string;
  image_url: string;
}

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
        }
      });

      if (!response.ok) {
        console.error("Error: network response not ok");
        return;
      }

      const data = await response.json();
      setTrees(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des arbres :", error);
      setTimeout(fetchAllTrees, 5000);
    }
  }

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
            {trees ? (
              <MapView
                mapType="standard"
                style={styles.map}
                initialRegion={initialRegion}
              >
                {trees.map(tree => {
                  return (
                    <Marker
                      key={tree.id_tree}
                      coordinate={{
                        latitude: parseFloat(tree.latitude),
                        longitude: parseFloat(tree.longitude)
                      }}
                      title={tree.name_fr}
                      icon={tree.id_tree % 3 == 0 ? require('@/assets/images/marqueurArbreMauve.png') : require('@/assets/images/marqueurArbreVert.png')}
                    >
                      <Callout tooltip>
                        <View style={styles.callout}>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Espèce (FR) :</Text>
                            <Text style={styles.calloutValue}>{tree.name_fr}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Espèce (EN) :</Text>
                            <Text style={styles.calloutValue}>{tree.name_en}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Espèce (LA) :</Text>
                            <Text style={styles.calloutValue}>{tree.name_la}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Genre :</Text>
                            <Text style={styles.calloutValue}>{tree.genre}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Famille :</Text>
                            <Text style={styles.calloutValue}>{tree.family_name}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Date de mesure :</Text>
                            <Text style={styles.calloutValue}>{formatDate(tree.date_measure)}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Date de plantation :</Text>
                            <Text style={styles.calloutValue}>{formatDate(tree.date_plantation)}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Latitude :</Text>
                            <Text style={styles.calloutValue}>{tree.latitude}</Text>
                          </View>
                          <View style={styles.calloutRow}>
                            <Text style={styles.calloutLabel}>Longitude :</Text>
                            <Text style={styles.calloutValue}>{tree.longitude}</Text>
                          </View>
                        </View>
                      </Callout>
                    </Marker>
                  );
                }
                )}
              </MapView>) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
            }
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
    width: '50%'
  },
  calloutValue: {
    fontSize: 14,
    textAlign: 'right',
    width: '50%'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});