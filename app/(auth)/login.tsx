import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { theme } from "../styles/theme";

export default function Login() {
  const [name, setName] = useState("");

  const login = async () => {
    if (!name.trim()) {
      Alert.alert("SmartLeash", "Escribe tu nombre 🐶");
      return;
    }

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ name })
    );

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logo-smartleash.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        SmartLeash
      </Text>

      <Text style={styles.subtitle}>
        Porque la comunicación siempre ha existido;
        {"\n"}
        SmartLeash la adapta a las nuevas necesidades de tu mejor amigo.
      </Text>

      <TextInput
        placeholder="Tu nombre"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
      >
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.link}>
          Crear una cuenta
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },

  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: theme.spacing.lg,
  },

  title: {
    fontSize: theme.typography.logo.fontSize,
    fontWeight: "700",
    textAlign: "center",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: theme.typography.body.fontSize,
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },

  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },

  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },

  buttonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },

  link: {
    marginTop: theme.spacing.lg,
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: theme.typography.body.fontSize,
  },
});