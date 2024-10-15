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
import { useEffect, useState } from "react";

import { CameraCapturedPicture } from "expo-camera";
import Config from "@/config";

async function* streamResponseChunks(response: Response) {
  let buffer = "";

  const CHUNK_SEPARATOR = "\n\n";

  let processBuffer = async function* (streamDone = false) {
    while (true) {
      let flush = false;
      let chunkSeparatorIndex = buffer.indexOf(CHUNK_SEPARATOR);
      if (streamDone && chunkSeparatorIndex < 0) {
        flush = true;
        chunkSeparatorIndex = buffer.length;
      }
      if (chunkSeparatorIndex < 0) {
        break;
      }

      let chunk = buffer.substring(0, chunkSeparatorIndex);
      buffer = buffer.substring(chunkSeparatorIndex + CHUNK_SEPARATOR.length);
      chunk = chunk.replace(/^data:\s*/, "").trim();
      if (!chunk) {
        if (flush) break;
        continue;
      }
      try {
        let parsedChunk = JSON.parse(chunk);
        let { error, text } = parsedChunk;

        if (error) {
          console.error(error);
          throw new Error(error?.message || JSON.stringify(error));
        }

        yield text;
      } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error(`Received non-JSON response: ${chunk}`);
      }
    }
  };

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is null");
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);
      yield* processBuffer();
    }
  } finally {
    reader.releaseLock();
  }

  yield* processBuffer(true);
}

type Content = {
  role: string;
  parts: (
    | { inline_data: { mime_type: string; data: string }; text?: undefined }
    | { text: string; inline_data?: undefined }
  )[];
};

export async function* streamGemini({
  model = "gemini-1.5-flash",
  contents = [],
}: { model?: string; contents?: Content[] } = {}) {
  let response = await fetch(`${Config.API_URL}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, contents }),
  });

  yield* streamResponseChunks(response);
}

export default function TreeAnalyzerCapture() {
  const colorScheme = useColorScheme();
  const { cameraPermission, galleryPermission } = usePermissions();
  const router = useRouter();

  let content;

  if (cameraPermission === null || galleryPermission === null) {
    content = <ThemedText>Asking for permissions...</ThemedText>;
  }

  const onConfirm = async (photo: CameraCapturedPicture | undefined) => {
    // Add AI logic here
    let result = "Analyzing...";
    let imageBase64;
    try {
      imageBase64 = photo?.base64;
      if (imageBase64) {
        imageBase64 = imageBase64.replace("data:image/png;base64,", "");
        //console.log(`Image base64 2 : ${imageBase64}`);
        let contents = [
          {
            role: "user",
            parts: [
              { inline_data: { mime_type: "image/png", data: imageBase64 } },
              {
                text: "Provide the name of the species in latin, the family, and the genre of the tree in the image in JSON format.",
              },
            ],
          },
        ];

        let buffer = [];
        for await (let chunk of streamGemini({
          model: "gemini-1.5-flash",
          contents,
        })) {
          buffer.push(chunk);
          result = buffer.join("");
        }
      } else {
        throw new Error("Failed to convert image to base64");
      }
    } catch (error) {
      console.error(`Error getting image as base64: ${error}`);
    }

    // navigate to results page
    //alternative: router.push with same arguments
    router.navigate({
      pathname: "/tree-analyzer/analysis-results",
      params: { photo: photo?.base64 },
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
