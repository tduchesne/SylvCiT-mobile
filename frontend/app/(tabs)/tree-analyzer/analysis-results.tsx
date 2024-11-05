import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, useRouter} from "expo-router";
import { useState } from "react";
import {
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";

export default function AnalyseResults() {
  //TODO:
  // - Add a way to upload an image of the tree
  // - Add JSON data to frontend to display the tree's information
  // - Add functionality to cancel the operation, need to go back to another page ('ajouter arbre' maybe ? TBD)
  const router = useRouter();

  const params = useLocalSearchParams();
  
  const family: string = Array.isArray(params.family) ? params.family[0] : (params.family || "");
  const latinName: string = Array.isArray(params.latinName) ? params.latinName[0] : (params.latinName || "");
  const genre: string = Array.isArray(params.genre) ? params.genre[0] : (params.genre || "");

  const colorScheme = useColorScheme(); // Detect the color scheme (light or dark)

  // cond styling based on the color scheme
  const isDarkMode = colorScheme === "dark";

  //cannot change the colors.ts cause will change all the colors in the app...

  //light mode
  const lightColors = {
    backgroundColor: "#F0F4F8",
    textColor: "#555",
    insideColor: "black",
    borderColor: "#80CBC4",
    buttonGreen: "#4CAF50",
    buttonRed: "#f44336",
    titleColor: "#2E7D32",
  };

  //dark mode
  const darkColors = {
    backgroundColor: "#232825",
    textColor: "#E0E0E0",
    insideColor: "black",
    borderColor: "#65976f",
    buttonGreen: "#447346",
    buttonRed: "#a3271d",
    titleColor: "#E0E0E0",
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const Form_analyse_arbre = () => {
    const [adresse, setAdresse] = useState<string>("");
    const [especeLat, setEspeceLat] = useState<string>(latinName);
    const [especeFr, setEspeceFr] = useState<string>("");
    const [especeAng, setEspeceAng] = useState<string>("");
    const [dhp, setDhp] = useState<string>(""); // Format: numeric/numeric
    const [famille, setFamille] = useState<string>(family);
    const [genreTree, setGenreTree] = useState(genre);
    const [datePlantation, setDatePlantation] = useState<string>("");
    const [dateMesure, setDateMesure] = useState<string>("");


    // Image URL received from backend
    const [imageUrl, setImageUrl] = useState<string>(""); // Empty by default

    // Placeholder image for when the image URL isn't available
    const placeholderImage = "https://via.placeholder.com/150";

    return (
      <SafeAreaView
        style={[styles.form, { backgroundColor: colors.backgroundColor }]}
      >
        <ScrollView>
          <Text style={[styles.titrePage, { color: colors.titleColor }]}>
            Votre arbre
          </Text>

          {/* Display the image TODO*/}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl ? imageUrl : placeholderImage }} // Display the image or a placeholder
              style={styles.treeImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Adresse
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setAdresse}
              value={adresse}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Espèce (Latin)
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setEspeceLat}
              value={especeLat}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Espèce (Français)
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setEspeceFr}
              value={especeFr}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Espèce (Anglais)
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setEspeceAng}
              value={especeAng}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.dhpContainer}>
              <Text style={[styles.label, { color: colors.textColor }]}>
                DHP
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setDhp}
              value={dhp}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Famille
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setFamille}
              value={famille}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Genre
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setGenreTree}
              value={genreTree}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Date de Plantation
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.insideColor },
              ]}
              onChangeText={setDatePlantation}
              value={datePlantation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textColor }]}>
              Date de Mesure
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.borderColor, color: colors.textColor },
              ]}
              onChangeText={setDateMesure}
              value={dateMesure}
            />
          </View>

          <View style={styles.boutonContainer}>
            <TouchableOpacity
              style={[
                styles.boutonFilled,
                { backgroundColor: colors.buttonGreen },
              ]}
              onPress={confirmer}
            >
              <Text style={styles.boutonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.boutonContainer}>
            <TouchableOpacity
              style={[
                styles.boutonFilledRed,
                { backgroundColor: colors.buttonRed },
              ]}
              onPress={annuler}
            >
              <Text style={styles.boutonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return <Form_analyse_arbre />;
}

function confirmer() {
  Alert.alert("Arbre ajouté");
}

function annuler() {
  Alert.alert("Annuler", "Voulez-vous vraiment annuler l'opération ?", [
    { text: "Oui" },
    { text: "Non" },
  ]);
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingHorizontal: 30, // Internal padding
    paddingVertical: 40,   // Internal padding
    marginHorizontal: 20,  // External margin to provide spacing from screen edges
    marginVertical: 20,
    backgroundColor: "#2E2E2E", // Background color for the rounded container
    borderRadius: 20,       // Rounded corners
    shadowColor: "#000",    // Shadow to give a card effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,  
  },
  inputContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  boutonContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  boutonFilled: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  boutonFilledRed: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  boutonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  titrePage: {
    fontSize: 30,
    textTransform: "uppercase",
    paddingBottom: 30, // Reduced bottom padding to 30
    paddingTop: 20,    // Added padding at the top for separation
    textAlign: "center",
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dhpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  treeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
