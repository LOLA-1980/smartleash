import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Login() {
  const [name, setName] = useState("");

  const handleLogin = async () => {
    if (!name.trim()) {
      alert("Escribe tu nombre 🐶");
      return;
    }

    await AsyncStorage.setItem("user", JSON.stringify({ name }));
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐶 SmartLeash</Text>

      <Text style={styles.subtitle}>
        Conecta con tus perritos 💖
      </Text>

      <TextInput
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fbc2eb",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "white",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#ff8fab",
    padding: 15,
    borderRadius: 15,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});