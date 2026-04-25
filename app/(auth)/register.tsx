import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ email, password })
    );

    alert("Registrado!");
    router.replace("/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Registro</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity onPress={handleRegister}>
        <Text>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}