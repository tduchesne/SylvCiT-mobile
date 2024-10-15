import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { CameraCapturedPicture } from "expo-camera";


async function* streamResponseChunks(response: Response) {
  let buffer = '';

  const CHUNK_SEPARATOR = '\n\n';

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
      chunk = chunk.replace(/^data:\s*/, '').trim();
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
    throw new Error('Response body is null');
  }
  
  try {
    while (true) {
      const { done, value } = await reader.read()
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
  model = 'gemini-1.5-flash',
  contents = [],
}: { model?: string; contents?: Content[] } = {}) {
  let response = await fetch("http://localhost:5001/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, contents })
  });

  yield* streamResponseChunks(response);
}

export default function AnalyseResults() {
  const { photo } = useLocalSearchParams(); // Access the passed params
  const parsedPhoto : CameraCapturedPicture = JSON.parse(photo as string); // Parse the photo back into an object
  console.log(parsedPhoto);
  const [result, setResult] = useState<string>("Analyzing...");
  // Add AI analysis here! [3. Intégrer API AI pour l'analyse de photo]
  useEffect(() => {
    const fetchResults = async () => {
      let imageBase64;
      try {
          imageBase64 = parsedPhoto.base64;
          if (imageBase64) {
            let contents = [
              {
                role: 'user',
                parts: [
                  { inline_data: { mime_type: 'image/png', data: imageBase64 } },
                  { text: 'Provide the name of the species in latin, the family, and the genre of the tree in the image in JSON format.' }
                ]
              }
            ];

            let buffer = [];
            for await (let chunk of streamGemini({ model: 'gemini-1.5-flash', contents })) {
              buffer.push(chunk);
              setResult(buffer.join(''));
            }
          } else {
            throw new Error('Failed to convert image to base64');
          }
        } catch (error) {
        console.error(`Error getting image as base64: ${error}`);
      }
    };

    fetchResults();
  }, [parsedPhoto]);

  return (
    <View>
      <ThemedText>AnalyseResults here!</ThemedText>
    </View>
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
