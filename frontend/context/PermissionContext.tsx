import React, { createContext, useContext, useEffect, useState } from "react";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

interface PermissionContextType {
  cameraPermission: boolean | null;
  galleryPermission: boolean | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export const PermissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === "granted");
    };

    requestPermissions();
  }, []);

  return (
    <PermissionContext.Provider value={{ cameraPermission, galleryPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);

  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider.");
  }

  return context;
};
