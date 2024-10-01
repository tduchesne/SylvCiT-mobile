import { Image, StyleSheet, Platform } from "react-native";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  return (
    <Screen
      title="SylvCiT"
      content={
        // cette partie est a modifier pour controler l'interieur de la page.
        <ThemedText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur
          ipsum natus aspernatur error eveniet vel quos, libero architecto quae,
          veniam repellat fugit eos! Culpa minus debitis numquam repellat alias.
        </ThemedText>
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
