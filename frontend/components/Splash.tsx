import { ActivityIndicator, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import React from "react";

export default function SplashScreenComponent() {
  return (
    <Animated.View style={styles.container} exiting={FadeOut}>
      <Animated.Image
        entering={FadeIn}
        source={require("@/assets/images/adaptive-icon-name.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={"#65976f"} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  image: {
    width: "100%",
  },
});
