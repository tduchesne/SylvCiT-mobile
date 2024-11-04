
import React from "react";
import { View, Image, Button, StyleSheet, Dimensions } from "react-native";
import { Colors } from '../constants/Colors'; 

interface PhotoReviewComponentProps {
  photo: any; 
  onConfirm: () => void;
  onDeny: () => void; 
}
const greenColor = Colors.light.buttonBackground;

const PhotoReviewComponent: React.FC<PhotoReviewComponentProps> = ({ photo, onConfirm, onDeny }) => {
  return (
    <View style={styles.container}>
      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={styles.photo}
        />
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
        <Button title="Confirm" onPress={onConfirm} color={greenColor}/>
        </View>
        <View style={styles.button}>
        <Button title="Deny" onPress={onDeny} color="#3E2723"/>
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  photo: {
    width: width * 0.8, // Full-screen width
    height: height * 0.8, // Height set to 80% of the screen
    resizeMode: "cover", // Ensure the image covers the screen but maintains its aspect ratio
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around", 
    width: "90%", 
    marginTop: "5%",
    marginBottom: "5%",
  },
  button: {
    width: "45%",
  },
});

export default PhotoReviewComponent;