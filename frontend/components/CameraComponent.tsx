import React, { useEffect, useRef, useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Camera, CameraType, CameraView } from "expo-camera";
import PhotoReviewComponent from "./PhotoReviewComponent";

interface CameraComponentProps {
  onCapture: (photo: any) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
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
  
  const onConfirm=()=>{
    console.log("go to next page");
    onCapture(photo); // photo must be sent to the parent component via the onCapture prop.
    
  }
  const onDeny=()=>{
    console.log("take another picture");
    setPhoto(null);
  }

  return (
    <View style={styles.container}>
      {!photo ? ( // Conditionally render CameraView if photo is NULL
        <CameraView
          style={styles.camera}
          facing="back"
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={handleCameraReady}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <Button title="Take Picture" onPress={takePicture} />
          </View>
        </CameraView>
      ) : (
        // Conditionally render PhotoReviewComponent if a photo is NOT NULL
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
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CameraComponent;
