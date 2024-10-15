import { StyleSheet, Image, View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import Screen from "@/components/Screen";
import { usePermissions } from "@/context/PermissionContext";
import { useRouter } from "expo-router";
import CameraComponent from "@/components/CameraComponent";

export default function TreeAnalyzerCapture() {
  const colorScheme = useColorScheme();
  const { cameraPermission, galleryPermission } = usePermissions();
  const router = useRouter();

  let content;

  if (cameraPermission === null || galleryPermission === null) {
    content = <ThemedText>Asking for permissions...</ThemedText>;
  }

  const onConfirm = (photo: any) => {
    console.log("go to analysis");
    //console.log(photo);
    //console.log(photo.uri);

    //alternative: router.push with same arguments
    router.navigate({
      pathname: "/tree-analyzer/analysis-results",
      params: { photo: photo.base64 },
    });
  };

  if (!cameraPermission || !galleryPermission) {
    content = (
      <View>
        <ThemedText style={{ textAlign: "center", fontWeight: "bold" }}>
          'Camera' and 'Photos and videos' permissions denied.{"\n"}
        </ThemedText>

        <ThemedText style={{ textAlign: "center" }}>
          Please enable 'Camera' and 'Photos and videos' permissions on
          settings.{"\n"}
          {"\n"}
          With the camera, you can take a picture of a tree and the app will
          analyze the picture using IA to give you information about the tree.
        </ThemedText>
      </View>
    );
  }

  let defaultScreen = (
    <Screen
      title="Tree Analyzer"
      content={content}
      headerImage={
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.treeLogo}
        />
      }
    />
  );

  return cameraPermission && galleryPermission ? (
    <CameraComponent onCapture={onConfirm} />
  ) : (
    defaultScreen
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
