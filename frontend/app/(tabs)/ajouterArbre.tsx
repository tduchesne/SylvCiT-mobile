import FormAjoutArbre from "@/components/FormAjouterArbre/FormAjouterArbre";
import Screen from "@/components/Screen";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AuthScreen from "@/components/AuthScreen";
import { useUserRole } from "@/context/UserRoleContext";
import { ThemedText } from "@/components/ThemedText";

export default function AjouterArbre() {
  const { userRole } = useUserRole();
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  const handleShowAuthScreen = () => {
    setShowAuthScreen(true);
  };

  useEffect(() => {
    if (userRole >= 1) {
      setShowAuthScreen(false);
    }
  }, [userRole]);

  return (
    <ThemedView style={styles.container}>
      <Screen
        title="Ajouter Arbre"
        content={
          showAuthScreen ? (
            <AuthScreen />
          ) : userRole >= 1 ? (
            <FormAjoutArbre />
          ) : (
            <ThemedView>
              <ThemedText>
                Vous devez vous authentifier avec les bonnes permissions pour
                voir le contenu de cette page.
              </ThemedText>
              <TouchableOpacity
                style={styles.button}
                onPress={handleShowAuthScreen}
              >
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  treeLogo: {
    height: 230,
    width: 310,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -155 }, { translateY: -115 }],
  },
});
