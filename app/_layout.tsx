import { Stack } from "expo-router";
import { BLEProvider } from "./contexts/BLEContext";

export default function RootLayout() {
  return (
    <BLEProvider>

      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />

        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />

        <Stack.Screen name="dog/[dog]" />

        <Stack.Screen name="connect" />
        <Stack.Screen name="train" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />

        <Stack.Screen name="modal" />

      </Stack>

    </BLEProvider>
  );
}