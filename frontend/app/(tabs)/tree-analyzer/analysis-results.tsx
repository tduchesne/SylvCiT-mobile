import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

async function getImageAsBase64(imageUri: string) {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function* streamResponseChunks(response: Response) {
  let buffer = '';
  const CHUNK_SEPARATOR = '\n\n';

  const processBuffer = async function* (streamDone = false) {
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
      let { error, text } = JSON.parse(chunk);
      if (error) {
        console.error(error);
        throw new Error(error?.message || JSON.stringify(error));
      }
      yield text;
      if (flush) break;
    }
  };

  const reader = response.body?.getReader();
  try {
    while (true) {
      const { done, value } = await reader?.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);
      yield* processBuffer();
    }
  } finally {
    reader?.releaseLock();
  }

  yield* processBuffer(true);
}

async function* streamGemini(model = 'gemini-1.5-flash', contents = []) {
  let response = await fetch("api/generate", {  
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, contents })
  });

  yield* streamResponseChunks(response);
}

export default function AnalyseResults() {
  const { photo } = useLocalSearchParams(); // Access the passed params
  const parsedPhoto = JSON.parse(photo as string); // Parse the photo back into an object
  console.log("analyzing results...");
  console.log(parsedPhoto);
  const [result, setResult] = useState<string>("Analyzing...");
  // Add AI analysis here! [3. Intégrer API AI pour l'analyse de photo]
  useEffect(() => {
    const analyzePhoto = async () => {
      try {
        
        let imageBase64 = await getImageAsBase64(parsedPhoto.uri);
        console.log("Image in base64: ", imageBase64); 

        let contents = [
          {
            role: 'user',
            parts: [
              { inline_data: { mime_type: 'image/jpg', data: imageBase64 } },  
              { text: 'Provide the name of the species in Latin, the family, and the genre of the tree in the image in JSON format.' }
            ]
          }
        ];

        let buffer: string[] = [];
        const stream = streamGemini("gemini-1.5-flash", contents);
        
        for await (let chunk of stream) {
          buffer.push(chunk);
          setResult(buffer.join(''));  
        }
      } catch (e) {
        setResult(`Error: ${e.message}`);
      }
    };

    analyzePhoto();  
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
