import { Image, StyleSheet, Platform, View } from "react-native";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import CameraCapture from "./camera-capture22";

export default function AnalyseResults() {
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
