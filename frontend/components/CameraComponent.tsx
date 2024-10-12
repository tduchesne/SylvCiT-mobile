import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import PhotoReviewComponent from "./PhotoReviewComponent";

interface CameraComponentProps {
  onCapture: (photo: any) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>();
  const [photo, setPhoto] = useState<any>(null);

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef && cameraRef && isCameraReady) {
      const photo = await cameraRef.takePictureAsync();
      setPhoto(photo);
    }
  };

  const onConfirm = () => {
    onCapture(photo);
  };

  const onDeny = () => {
    setPhoto(null);
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
              position: "absolute",
              bottom: "5%",
              left: "50%",
            }}
          >
            <Button
              title="PHOTO"
              onPress={takePicture}
              color="#056122"
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
