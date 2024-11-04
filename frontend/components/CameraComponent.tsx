import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { CameraCapturedPicture, CameraView, CameraPictureOptions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import PhotoReviewComponent from "./PhotoReviewComponent";
import { Colors } from "@/constants/Colors";

interface CameraComponentProps {
  onCapture: (photo: undefined | CameraCapturedPicture) => void;
}
const greenColor = Colors.light.buttonBackground;

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>();
  const [photo, setPhoto] = useState<undefined | CameraCapturedPicture>(undefined);
  const { height } = Dimensions.get("window");

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef && isCameraReady) {
      const options: CameraPictureOptions = {
        quality: 0.2,
        base64: true,
        imageType: "jpg",
      };
      const photo = await cameraRef.takePictureAsync(options);
      setPhoto(photo);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });
  
    if (!result.canceled) {
      // Adapting the selected image to match CameraCapturedPicture format
      const selectedPhoto = {
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
        base64: result.assets[0].base64,
      } as CameraCapturedPicture;
      
      setPhoto(selectedPhoto);
    }
  };

  const onConfirm = () => {
    onCapture(photo);
  };

  const onDeny = () => {
    setPhoto(undefined);
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView
          style={styles.camera}
          facing="back"
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={handleCameraReady}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.shutterButton} onPress={takePicture} />
          </View>

          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
              <Image
                source={require("../assets/images/gallery.png")} 
                style={styles.galleryIcon}
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <PhotoReviewComponent
          photo={photo}
          onConfirm={onConfirm}
          onDeny={onDeny}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Dimensions.get("window").height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  galleryButton: {
    backgroundColor: greenColor,
    padding: 10,
    borderRadius: 20,
    marginRight: Dimensions.get("window").height * .40,
  },
  galleryIcon: {
    width: 40,
    height: 30,
    tintColor: '#fff',
  },
  shutterButton: {
    width: 70,
    height: 70,
    backgroundColor: greenColor,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CameraComponent;
