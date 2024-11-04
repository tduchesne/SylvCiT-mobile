import React, { useState } from "react";
import { View, Button, StyleSheet, Dimensions } from "react-native";
import { CameraCapturedPicture, CameraView, CameraPictureOptions} from "expo-camera";
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
    if (cameraRef && cameraRef && isCameraReady) {
      const options: CameraPictureOptions = {
        quality: 0.2,
        base64: true,
        imageType: "jpg",
      };

      const photo = await cameraRef.takePictureAsync();
      setPhoto(photo);
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
      {!photo ? ( // if photo is NULL, show the camera
        <CameraView
          style={styles.camera}
          facing="back"
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={handleCameraReady}
        >
          <View
            style={{
              position: 'absolute', 
              bottom: height * 0.05,
              left: '50%', 
              transform: [{ translateX: -100 }],
              width: 200, 
              maxWidth: '100%',
            }}

          >
            <Button
              title="PHOTO"
              onPress={takePicture}
              color={greenColor}
            />
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
});

export default CameraComponent;
