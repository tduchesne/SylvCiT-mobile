import Screen from "@/components/Screen";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useUserRole } from "@/context/UserRoleContext"; 
import { useEffect, useState } from "react";
import AuthScreen from "@/components/AuthScreen";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
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
    <Screen
      title="Account"
      content={
        showAuthScreen ? (
          <AuthScreen />
        ) :
        userRole >= 1 ?  (

          // Ici va le contenu de la page
          <ThemedText>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur
            ipsum natus aspernatur error eveniet vel quos, libero architecto
            quae, veniam repellat fugit eos! Culpa minus debitis numquam
            repellat alias. Page explore. n'importe quoi for now.
          </ThemedText>
          // fin du contenu

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
