import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import FormSupprimerArbres from "@/components/FormSupprimerArbres";
import Screen from "@/components/Screen";
import { useUserRole } from "@/context/UserRoleContext";
import AuthScreen from "@/components/AuthScreen";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function SupprimerArbres() {
  const { userRole } = useUserRole(); 
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  const handleShowAuthScreen = () => {
    setShowAuthScreen(true);
  };

  useEffect(() => {
    if (userRole >= 2) {
      setShowAuthScreen(false); 
    }
  }, [userRole]);
  
  return (
    <Screen
      title="Supprimer Arbres"
      content={
        showAuthScreen ? (
          <AuthScreen />
        ) :
        userRole >= 2 ?  (
      <FormSupprimerArbres />
    ) : (
      <ThemedView>
      <ThemedText>
        Vous devez vous authentifier avec les bonnes permissions pour voir
        le contenu de cette page.
        </ThemedText>
        <TouchableOpacity 
            style={styles.button} 
            onPress={handleShowAuthScreen}>
          <ThemedText style={{ textDecorationLine: "underline" }}>
            se connecter.
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    )
  }
      headerImage={
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.treeLogo}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  treeLogo: {
    height: 230,
    width: 310,
    bottom: 0,
    left: 36,
    position: "absolute",
  },
  button: {
    textDecorationLine: "underline",
    marginTop:25,
    justifyContent:"center",
    alignSelf: "center",
  },
});