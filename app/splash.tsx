import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function Splash() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");

      setTimeout(() => {
        if (user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      }, 2500);
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/splash-bg.png")}
        resizeMode="contain"
        style={[
          styles.image,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});