import { useBLE } from "@/app/contexts/BLEContext";
import { router } from "expo-router";
import { useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { theme } from "./styles/theme";

type Device = {
  id: string;
  name: string;
  rssi: number;
};

export default function ConnectSmartLeash() {

  const {
  connected,
  connect,
  disconnect,
  deviceName,
} = useBLE();
  
  const [searching, setSearching] = useState(false);

  const [devices, setDevices] = useState<Device[]>([]);

  const searchDevices = () => {
    setSearching(true);

    setDevices([]);

    setTimeout(() => {
      setDevices([
        {
          id: "1",
          name: "SmartLeash_01",
          rssi: -52,
        },
      ]);

      setSearching(false);
    }, 1500);
  };

  const connectDevice = (device: Device) => {
    connect(device.name);
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        📶 Conectar SmartLeash
      </Text>

      <Text style={styles.subtitle}>
        Busca el collar mediante Bluetooth
        para comenzar el entrenamiento.
      </Text>

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Estado
        </Text>

        <View style={styles.statusContainer}>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: connected
                  ? theme.colors.success
                  : theme.colors.danger,
              },
            ]}
          />

          <Text style={styles.statusText}>
            {connected
              ? "Conectado"
              : "Desconectado"}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchDevices}
          disabled={searching}
        >

          <Text style={styles.searchButtonText}>
            {searching
              ? "Buscando dispositivos..."
              : "Buscar dispositivos"}
          </Text>

        </TouchableOpacity>

      </View>

      {devices.length > 0 && (

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Dispositivos encontrados
          </Text>

          {devices.map((device) => (

            <View
              key={device.id}
              style={styles.deviceCard}
            >

              <View>

                <Text style={styles.deviceName}>
                  🐶 {device.name}
                </Text>

                <Text style={styles.rssi}>
                  RSSI {device.rssi} dBm
                </Text>

              </View>

              {!connected && (

                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => connectDevice(device)}
                >

                  <Text style={styles.connectButtonText}>
                    Conectar
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          ))}

        </View>

      )}

      {connected && (

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/train")}
        >

          <Text style={styles.continueText}>
            Continuar →
          </Text>

        </TouchableOpacity>

      )}

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },

  title: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: theme.typography.h1.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.card,
  },

  sectionTitle: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },

  statusText: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },

  searchButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },

  searchButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: theme.typography.body.fontSize,
  },

  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  deviceName: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },

  rssi: {
    marginTop: 4,
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },

  connectButton: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },

  connectButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: theme.typography.bodySmall.fontSize,
  },

  continueButton: {
    marginTop: "auto",
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },

  continueText: {
    color: theme.colors.white,
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: theme.typography.body.fontSize,
  },

});