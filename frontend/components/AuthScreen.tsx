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

// Main component for authentication
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

  // Function to log in a user
  const login = async () => {
    try {
      console.log("Attempting to log in...");

      // Create the request body
      const requestBody = {
        username: username,
        password: password,
      };

      const response = await fetch("http://172.20.10.4:5001/login", {
        method: "POST", // Specify the method as POST
        headers: {
          "Content-Type": "application/json", // Indicate that the request body is JSON
        },
        body: JSON.stringify(requestBody), // Convert the request body to JSON
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        console.log("Login successful! User role:", data.role);
        // Call the onPressLogin function with the user's role
        onPressLogin(data.role);
      } else {
        console.error("Login failed:", response.status, response.statusText);
        // Handle login failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }
  };

  const handleLogin = () => {
    login(); // Call the login function when the login button is pressed
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
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
      />
      <TextInput
        placeholder="Password"
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
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
