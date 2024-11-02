import Screen from "@/components/Screen";
import { StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useUserRole } from "@/context/UserRoleContext"; // Import the hook

export default function TabTwoScreen() {
  const { userRole } = useUserRole(); // Get the userRole from context

  return (
    <Screen
      title="Account"
      content={
        userRole >= 1 ? (
          // Modify this part to control the content of the page based on userRole
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
