import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");

        if (user) {
          setIsLogged(true);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 🔄 LOADER (mientras revisa sesión)
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>
          🐶 Cargando SmartLeash...
        </Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* 🐶 SPLASH (siempre primero) */}
      <Stack.Screen name="splash" />

      {/* 🔐 LOGIN si NO está logeado */}
      {!isLogged ? (
        <Stack.Screen name="login" />
      ) : (
        <>
          {/* 🏠 APP */}
          <Stack.Screen name="(tabs)" />
        </>
      )}

    </Stack>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbc2eb",
  },
  loaderText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});