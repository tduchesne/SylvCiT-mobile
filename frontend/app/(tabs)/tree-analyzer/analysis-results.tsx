import { Image, StyleSheet, Platform, View } from "react-native";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";

export default function AnalyseResults() {
  const { photo } = useLocalSearchParams(); // Access the passed params
  const parsedPhoto = JSON.parse(photo as string); // Parse the photo back into an object
  console.log("analysis results...");
  console.log(parsedPhoto);
  
  return (
    <View>
      <ThemedText>AnalyseResults here!</ThemedText>
    </View>
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
