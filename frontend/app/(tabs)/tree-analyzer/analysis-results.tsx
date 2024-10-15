import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { CameraCapturedPicture } from "expo-camera";

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
