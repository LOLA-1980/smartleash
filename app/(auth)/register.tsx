import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { theme } from "../styles/theme";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const register = async () => {

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({
        name,
        email,
        password,
      })
    );

    router.replace("/(tabs)");

  };


  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        Crear cuenta
      </Text>


      <Text style={styles.subtitle}>
        Comienza a conectar con tu mejor amigo.
      </Text>


      <TextInput
        placeholder="Nombre"
        placeholderTextColor={theme.colors.textLight}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />


      <TextInput
        placeholder="Correo"
        placeholderTextColor={theme.colors.textLight}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />


      <TextInput
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.textLight}
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />


      <TouchableOpacity
        style={styles.button}
        onPress={register}
      >

        <Text style={styles.buttonText}>
          Registrarme
        </Text>

      </TouchableOpacity>


    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: "center",

    padding: theme.spacing.xl,

    backgroundColor: theme.colors.background,

  },


  title: {

    fontSize: theme.typography.logo.fontSize,

    fontWeight: "700",

    color: theme.colors.text,

    marginBottom: theme.spacing.sm,

  },


  subtitle: {

    fontSize: theme.typography.body.fontSize,

    color: theme.colors.textSecondary,

    marginBottom: theme.spacing.xl,

  },


  input: {

    backgroundColor: theme.colors.surface,

    padding: theme.spacing.md,

    borderRadius: theme.radius.md,

    marginBottom: theme.spacing.md,

    borderWidth: 1,

    borderColor: theme.colors.border,

    color: theme.colors.text,

  },


  button: {

    backgroundColor: theme.colors.primary,

    padding: theme.spacing.md,

    borderRadius: theme.radius.md,

  },


  buttonText: {

    color: theme.colors.white,

    fontWeight: "700",

    textAlign: "center",

    fontSize: theme.typography.body.fontSize,

  },


});