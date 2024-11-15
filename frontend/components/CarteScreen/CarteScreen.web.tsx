import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import Screen from '@/components/Screen';

export default function CarteScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Screen
        title="Carte"
        content={
          <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>
              La carte n'est pas disponible sur le web pour le moment.
            </p>
            <button
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => window.open('https://sylvcit.ca/app', '_blank')}
            >
              Accéder à la carte sylvcit
            </button>
          </div>
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
