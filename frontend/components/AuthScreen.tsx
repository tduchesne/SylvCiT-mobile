import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "./ThemedText";

//logique a void en attendant l'implementation
export default function AuthScreen({
  onPressLogin,
  onPressVisitor,
}: {
  onPressLogin: (role: number) => void;
  onPressVisitor: () => void;
}) {
  const colorScheme = useColorScheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const pingServer = async () => {
    try {
      console.log("ping await...");
      const response = await fetch("http://172.20.10.4:5001/");

      if (response.ok) {
        const data = await response.json(); // Or response.text()
        console.log("Ping successful! Response:", data);
      } else {
        console.log("ca marche pas");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Simulated function to verify user credentials
  const verifyUserCredentials = (
    username: string,
    password: string
  ): number => {
    if (username === "admin" && password === "admin") {
      pingServer();
      console.log("ca marche admin");
      return 2; // Role for admin
    } else if (username === "guest" && password === "guest") {
      console.log("ca marche guest");
      return 1; // Role for regular user
    }
    console.log("marche pas");
    return -1;
  };

  const handleLogin = () => {
    const verifiedRole = verifyUserCredentials(username, password); //
    if (verifiedRole > 0) {
      onPressLogin(verifiedRole);
    } else {
      console.error("Invalid credentials");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <FontAwesome
        name="user-circle-o"
        size={124}
        color={colorScheme === "dark" ? "#7bb586" : "#046122"}
        style={styles.icon}
      />
      <TextInput
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? "light"].buttonBackground },
        ]}
      >
        <Text style={[{ color: Colors[colorScheme ?? "light"].buttonText }]}>
          LOGIN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressVisitor} style={styles.link}>
        <ThemedText style={{ textDecorationLine: "underline" }}>
          Continue en tant que visiteur
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  icon: {
    alignSelf: "center",
    marginBottom: 25,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    height: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
