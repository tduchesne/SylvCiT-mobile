import { StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import React from 'react';


export function TreeWave() {
  const rotationAnimation = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      // pour reset l'animation
      rotationAnimation.value = 0;

      // demarrer l'animation
      rotationAnimation.value = withRepeat(
        withSequence(
          withTiming(25, { duration: 150 }),
          withTiming(0, { duration: 150 })
        ),
        4 // shake la feuille 4 fois
      );
    }, [rotationAnimation])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        style={styles.image}
        source={require("@/assets/images/icon.png")}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
});
