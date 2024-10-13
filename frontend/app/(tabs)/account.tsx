import Screen from "@/components/Screen";
import { StyleSheet, Image, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { userRole } from "@/constants/Role";

export default function TabTwoScreen() {
  return (
    <Screen
      title="Account"
      content={
        userRole >= 1 ? (
          // cette partie est a modifier pour controler l'interieur de la page.
          <ThemedText>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur
            ipsum natus aspernatur error eveniet vel quos, libero architecto
            quae, veniam repellat fugit eos! Culpa minus debitis numquam
            repellat alias. Page explore. n'importe quoi for now.
          </ThemedText>
        ) : (
          <ThemedText>
            Vous devez vous authentifier avec les bonnes permissions pour voir
            le contenu de cette page
          </ThemedText>
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
});
