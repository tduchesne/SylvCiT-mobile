import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
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
        <TouchableOpacity style={[styles.button, { backgroundColor: greenColor }]} onPress={onConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#232826" }]} onPress={onDeny}>
          <Text style={styles.buttonText}>Deny</Text>
        </TouchableOpacity>
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
    backgroundColor:'#454746',
    borderRadius: 5, 
  },
  photo: {
    width: width * 0.8, // Full-screen width
    height: height * 0.8, // Height set to 80% of the screen
    resizeMode: "cover", // Ensure the image covers the screen but maintains its aspect ratio
    borderRadius: 20, 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around", 
    width: "90%", 
    marginTop: "5%",
    marginBottom: "15%",
  },
  button: {
    width: "45%",
    padding: 10,
    borderRadius: 15, 
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PhotoReviewComponent;
