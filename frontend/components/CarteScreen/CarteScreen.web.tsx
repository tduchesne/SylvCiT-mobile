import React, { useEffect, useRef, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import Screen from '@/components/Screen';
import Config from '@/config';


let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  require('leaflet/dist/leaflet.css');
}

const greenTreeIconUrl = 'https://cdn-icons-png.flaticon.com/512/685/685025.png';
const purpleTreeIconUrl = 'https://cdn-icons-png.flaticon.com/512/685/685025.png';


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

export default function CarteScreenWeb() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markersGroupRef = useRef<any>(null);

  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    fetchAllTrees();
  }, []);

  const fetchAllTrees = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/api/trees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Erreur lors de la récupération des arbres : réseau non OK');
        return;
      }

      const data = await response.json();
      setTrees(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des arbres :', error);
    }
  };

  // Initialiser la carte et ajouter les marqueurs
  useEffect(() => {
    let map: any;
    if (typeof window !== 'undefined' && mapRef.current) {
      map = L.map(mapRef.current, {
        center: [45.5017, -73.5673],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);

      // Ajouter les marqueurs après récupération des arbres
      if (trees.length > 0 && markersGroupRef.current) {
        markersGroupRef.current.clearLayers();

        trees.forEach((tree) => {
          const customIcon = L.icon({
            iconUrl: tree.id_tree % 3 === 0 ? purpleTreeIconUrl : greenTreeIconUrl,
            // Taille de l'icône
            iconSize: [12, 12], 
            iconAnchor: [20, 40], 
            popupAnchor: [0, -40], 
          });

          const marker = L.marker([tree.latitude, tree.longitude], {
            icon: customIcon,
          });

          marker.bindPopup(`
            <strong>Espèce (FR) :</strong> ${tree.name_fr}<br />
            <strong>Espèce (EN) :</strong> ${tree.name_en}<br />
            <strong>Espèce (LA) :</strong> ${tree.name_la}<br />
            <strong>Genre :</strong> ${tree.genre}<br />
            <strong>Famille :</strong> ${tree.family_name}<br />
            <strong>Date de mesure :</strong> ${formatDate(tree.date_measure)}<br />
            <strong>Date de plantation :</strong> ${formatDate(tree.date_plantation)}<br />
               <strong>Latitude :</strong> ${tree.latitude}<br />
            <strong>Longitude :</strong> ${tree.longitude}<br />
            <img src="${tree.image_url}" alt="Image de l'arbre" style="width: 100px; height: auto; margin-top: 5px;" />
          `);

          marker.addTo(markersGroupRef.current);
        });
      }
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [trees]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Screen
        title="Carte"
        content={
          <div
            ref={mapRef}
            style={{
              height: '80vh',
              width: '100%',
              borderRadius: '10px',
              margin: '0 auto',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        }
        headerImage={
          <img
            src="../../assets/images/adaptive-icon.png"
            alt="Image de l'en-tête"
            style={{
              height: '230px',
              width: '310px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        }
      />
    </ThemedView>
  );
}
