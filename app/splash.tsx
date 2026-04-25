import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Splash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 🔥 animación combinada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 🔐 verificar sesión
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");

      setTimeout(() => {
        if (user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      }, 2200);
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        {/* 🐶 LOGO */}
        <Text style={styles.logo}>🐶</Text>

        {/* APP NAME */}
        <Text style={styles.title}>SmartLeash</Text>

        {/* TAGLINE */}
        <Text style={styles.subtitle}>Conectando contigo 💖</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff8fab",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 60,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    marginTop: 5,
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
});